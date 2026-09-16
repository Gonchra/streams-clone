import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Follow } from '@prisma/generated/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class FollowModel implements Follow {
	@Field(() => ID)
	id: string

	@Field(() => String)
	followerId: string

	@Field(() => UserModel)
	follower: UserModel

	@Field(() => String)
	followingId: string

	@Field(() => UserModel)
	following: UserModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
