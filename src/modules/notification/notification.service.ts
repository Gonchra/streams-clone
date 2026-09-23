import { Injectable } from '@nestjs/common'
import {
	NotificationType,
	SponsorshipPlan,
	TokenType,
	type User
} from '@prisma/generated/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeNotificationSettingsInput } from '@/src/modules/notification/inputs/change-notification-settings.input'
import { generateToken } from '@/src/shared/utils/generate-token.util'

@Injectable()
export class NotificationService {
	constructor(private readonly prismaService: PrismaService) {}

	async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				isRead: false,
				userId: user.id
			}
		})

		return count
	}

	async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				isRead: false,
				userId: user.id
			},
			data: {
				isRead: true
			}
		})

		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return notifications
	}

	async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">Не пропустите!</b>
							<p>Присоединяйтесь к стриму на канале
							 	<a href="/${channel.username}" className="font-semibold">
							 	${channel.displayName}</a>.</p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">У вас новый подписчик!</b>
							<p>Это пользователь <a href="/${follower.username}" className="font-semibold">
							 	${follower.displayName}</a>.</p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User
	) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">У вас новый спонсор!</b>
						  <p>Пользователь <a href="/${sponsor.username}" className="font-semibold">${sponsor.displayName}</a> стал вашим спонсором, выбрав план <strong>${plan.title}</strong>.</p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	async createEnableTwoFactor(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">Обеспечьте свою безопасность!</b>
						  <p>Включите двухфакторную аутентификацию в настройках вашего аккаунта, чтобы повысить уровень защиты.</p>`,
				type: NotificationType.ENABLE_TWO_FACTOR,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	async createVerifyChannel(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">Поздравляем!</b>
						  <p>Ваш канал верифицирован, и теперь рядом с вашим каналом будет галочка.</p>`,
				type: NotificationType.VERIFIED_CHANNEL,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	async changeSettings(user: User, input: ChangeNotificationSettingsInput) {
		const { siteNotifications, telegramNotifications } = input

		const notificationSettings =
			await this.prismaService.notificationSettings.upsert({
				where: {
					userId: user.id
				},
				create: {
					siteNotifications,
					telegramNotifications,
					user: {
						connect: {
							id: user.id
						}
					}
				},
				update: {
					siteNotifications,
					telegramNotifications
				},
				include: {
					user: true
				}
			})

		if (
			notificationSettings.telegramNotifications &&
			notificationSettings.user &&
			!notificationSettings.user.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH
			)

			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token
			}
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user &&
			notificationSettings.user.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					telegramId: null
				}
			})
			return {
				notificationSettings
			}
		}
	}
}
