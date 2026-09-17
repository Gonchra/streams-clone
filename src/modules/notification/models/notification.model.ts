import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { type Notification, NotificationType } from '@prisma/generated/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

registerEnumType(NotificationType, {
	name: 'NotificationType'
})

@ObjectType()
export class NotificationModel implements Notification {
	@Field(() => ID)
	id: string

	@Field(() => String)
	message: string

	@Field(() => NotificationType)
	type: NotificationType

	@Field(() => Boolean)
	isRead: boolean

	@Field(() => UserModel)
	user: UserModel

	@Field(() => String)
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
