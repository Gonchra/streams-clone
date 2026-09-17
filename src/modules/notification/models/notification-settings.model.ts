import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { NotificationSettings } from '@prisma/generated/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
	@Field(() => ID)
	id: string

	@Field(() => Boolean)
	siteNotifications: boolean

	@Field(() => Boolean)
	telegramNotifications: boolean

	@Field(() => UserModel)
	user: UserModel

	@Field(() => String, { nullable: true })
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}

@ObjectType()
export class ChangeNotificationSettingsResponse {
	@Field(() => NotificationSettingsModel)
	notificationSettings: NotificationSettingsModel

	@Field(() => String, { nullable: true })
	telegramAuthToken?: string
}
