import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { SponsorshipPlan } from '@prisma/generated/client'
import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class PlanModel implements SponsorshipPlan {
	@Field(() => ID)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String, { nullable: true })
	description: string

	@Field(() => String)
	channelId: string

	@Field(() => UserModel)
	channel: UserModel

	@Field(() => String)
	stripePlanId: string

	@Field(() => String)
	stripeProductId: string

	@Field(() => Number)
	price: number

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
