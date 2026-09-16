import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '@prisma/generated/client'

import { SocialLinkModel } from '@/src/modules/auth/profile/models/social-link.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'
import { FollowModel } from '@/src/modules/follow/models/follow.model'

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => String)
	username: string

	@Field(() => String)
	displayName: string

	@Field(() => String, {
		nullable: true
	})
	avatar: string

	@Field(() => String, {
		nullable: true
	})
	bio: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isTotpEnabled: boolean

	@Field(() => String, { nullable: true })
	totpSecret: string

	@Field(() => Boolean)
	isDeactivated: boolean

	@Field(() => Date, { nullable: true })
	deactivatedAt: Date

	@Field(() => [SocialLinkModel])
	socialsLinks: SocialLinkModel[]

	@Field(() => [FollowModel])
	followers: FollowModel[]

	@Field(() => [FollowModel])
	followings: FollowModel[]

	@Field(() => StreamModel)
	stream: StreamModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
