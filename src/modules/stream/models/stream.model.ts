import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Stream } from '@prisma/generated/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { CategoryModel } from '@/src/modules/category/models/category.model'
import { ChatMessageModel } from '@/src/modules/chat/model/chat-message.model'

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String)
	thumbnailUrl: string

	@Field(() => String, { nullable: true })
	ingressId: string

	@Field(() => String, { nullable: true })
	serverUrl: string

	@Field(() => String, { nullable: true })
	streamKey: string

	@Field(() => Boolean)
	isLive: boolean

	@Field(() => Boolean)
	isChatEnabled: boolean

	@Field(() => Boolean)
	isChatFollowersOnly: boolean

	@Field(() => Boolean)
	isChatPremiumFollowersOnly: boolean

	@Field(() => UserModel)
	user: UserModel

	@Field(() => String)
	userId: string

	@Field(() => CategoryModel)
	category: CategoryModel

	@Field(() => String, { nullable: true })
	categoryId: string

	@Field(() => [ChatMessageModel])
	chatMessages: ChatMessageModel[]

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
