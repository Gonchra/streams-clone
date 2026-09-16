import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { ChatMessage } from '@prisma/generated/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'

@ObjectType()
export class ChatMessageModel implements ChatMessage {
	@Field(() => ID)
	id: string

	@Field(() => String)
	text: string

	@Field(() => UserModel)
	user: UserModel

	@Field(() => String)
	userId: string

	@Field(() => StreamModel)
	stream: StreamModel

	@Field(() => String)
	streamId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
