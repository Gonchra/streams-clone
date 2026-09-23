import { Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

import { SubscriptionModel } from '@/src/modules/sponsorship/subscription/models/subscription.model'
import { Authorization } from '@/src/shared/decorators/authorization.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { SubscriptionService } from './subscription.service'

@Resolver('Subscription')
export class SubscriptionResolver {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Authorization()
	@Query(() => [SubscriptionModel], { name: 'findMySponsors' })
	async findMySponsors(@Authorized() user: User) {
		return this.subscriptionService.findMySponsors(user)
	}
}
