import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/generated/client'
import { TokenType } from '@prisma/generated/enums'
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { Context, Telegraf } from 'telegraf'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { BUTTONS } from '@/src/modules/libs/telegram/telegram.buttons'
import { MESSAGES } from '@/src/modules/libs/telegram/telegram.messages'
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
		this._token =
			this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
	}

	@Start()
	async onStart(@Ctx() ctx: any) {
		const chatId = ctx.chat.id.toString()
		const token = ctx.message.text.split(' ')[1]

		if (token) {
			const authToken = await this.prismaService.token.findUnique({
				where: {
					token,
					type: TokenType.TELEGRAM_AUTH
				}
			})

			if (!authToken) {
				await ctx.replyWithHTML(MESSAGES.invalidToken)
				return
			}

			const hasExpired = new Date(authToken.expiresIn) < new Date()

			if (hasExpired) {
				await ctx.replyWithHTML(MESSAGES.invalidToken)
				return
			}

			await this.connectTelegram(authToken.userId, chatId)

			await this.prismaService.token.delete({
				where: {
					id: authToken.id
				}
			})

			await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess())
			return
		} else {
			const user = await this.findUserByChatId(chatId)

			if (user) {
				return await this.onMe(ctx)
			} else {
				await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
				return
			}
		}
	}

	@Action('me')
	@Command('me')
	async onMe(@Ctx() ctx: Context) {
		const chatId = ctx.chat!.id.toString()

		const user = await this.findUserByChatId(chatId)
		const followersCount = await this.prismaService.follow.count({
			where: {
				followingId: user.id
			}
		})
		await ctx.replyWithHTML(
			MESSAGES.profile(user, followersCount),
			BUTTONS.profile
		)
	}

	@Command('follows')
	@Action('follows')
	async onFollows(@Ctx() ctx: Context) {
		const chatId = ctx.chat!.id.toString()

		const user = await this.findUserByChatId(chatId)
		const follows = await this.prismaService.follow.findMany({
			where: {
				followerId: user.id
			},
			include: {
				following: true
			}
		})

		if (user && follows.length) {
			const followsList = follows
				.map(follow => MESSAGES.follows(follow.following))
				.join('\n')
			const message = `<b>Каналы на которые вы подписаны:</b> \n\n${followsList}`

			await ctx.replyWithHTML(message)
		} else {
			await ctx.replyWithHTML('<b>У вас нет подписок</b>')
		}
	}

	async sendPasswordResetToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.resetPassword(token, metadata),
			{ parse_mode: 'HTML' }
		)
	}

	async sendDeactivateToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.deactivate(token, metadata),
			{ parse_mode: 'HTML' }
		)
	}

	async sendAccountDeletion(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.accountDeleted, {
			parse_mode: 'HTML'
		})
	}

	async sendStreamStart(chatId: string, channel: User) {
		await this.telegram.sendMessage(chatId, MESSAGES.streamStart(channel), {
			parse_mode: 'HTML'
		})
	}

	async sendNewFollowing(chatId: string, follower: User) {
		const user = await this.findUserByChatId(chatId)

		await this.telegram.sendMessage(
			chatId,
			MESSAGES.newFollowing(follower, user.followings.length),
			{ parse_mode: 'HTML' }
		)
	}

	private async connectTelegram(userId: string, chatId: string) {
		await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				telegramId: chatId
			}
		})
	}

	private async findUserByChatId(chatId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				telegramId: chatId
			},
			include: {
				followers: true,
				followings: true
			}
		})

		return user!
	}
}
