import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'
import { TOTP } from 'otpauth'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { LoginInput } from '@/src/modules/auth/session/inputs/login.input'
import { VerificationService } from '@/src/modules/auth/verification/verification.service'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession, saveSession } from '@/src/shared/utils/session.util'

@Injectable()
export class SessionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private readonly verificationService: VerificationService
	) {}

	async findByUser(req: Request) {
		const userId = req.session.userId

		if (!userId) {
			throw new NotFoundException('Пользователь не обнаружен в сессии')
		}

		const keys = await this.redisService.keys('*')
		const userSessions: any[] = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)

			if (sessionData) {
				const session = JSON.parse(sessionData)

				if (session.userId === userId) {
					userSessions.push({
						...session,
						id: key.split(':')[1]
					})
				}
			}
		}

		userSessions.sort((a, b) => {
			const da =
				a.createdAt instanceof Date
					? a.createdAt
					: new Date(a.createdAt)
			const db =
				b.createdAt instanceof Date
					? b.createdAt
					: new Date(b.createdAt)
			return db.getTime() - da.getTime()
		})

		return userSessions.filter(session => session.id !== req.session.id)
	}

	async findCurrent(req: Request) {
		const sessionId = req.session.id
		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)
		const session = JSON.parse(sessionData!)

		return {
			...session,
			id: sessionId
		}
	}

	async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password, pin } = input

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ username: { equals: login } },
					{ email: { equals: login } }
				]
			}
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new UnauthorizedException('Неверный пароль')
		}

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)

			throw new BadRequestException(`
				Аккаунт не верифицирован. Пожалуйста, проверьте свою почту для подтверждения
			`)
		}

		if (user.isTotpEnabled) {
			if (!pin) {
				return {
					message: 'Необходим код для завершения авторизации'
				}
			}

			const secret = user.totpSecret ?? undefined

			const totp = new TOTP({
				issuer: 'Streams',
				label: `${user.email}`,
				algorithm: 'SHA1',
				digits: 6,
				secret
			})

			const delta = totp.validate({ token: pin })

			if (delta === null) {
				throw new BadRequestException('Неверный код')
			}
		}

		const metadata = getSessionMetadata(req, userAgent)

		return await saveSession(req, user, metadata)
	}

	async logout(req: Request) {
		return destroySession(req, this.configService)
	}

	async clearSession(req: Request) {
		req.res?.clearCookie(this.configService.getOrThrow('SESSION_NAME'))

		return true
	}

	async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException('Текущую сессию удалить нельзя')
		}

		await this.redisService.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
		)

		return true
	}
}
