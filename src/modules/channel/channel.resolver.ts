import { Args, Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

import { ChannelService } from './channel.service'

@Resolver('Channel')
export class ChannelResolver {
	constructor(private readonly channelService: ChannelService) {}

	@Query(() => [UserModel], { name: 'findRecommendedChannels' })
	async findRecommended() {
		return this.channelService.findRecommended()
	}

	@Query(() => UserModel, { name: 'findChannelByUsername' })
	async findByUsername(@Args('username') username: string) {
		return this.channelService.findByUsername(username)
	}

	@Query(() => Number, { name: 'findFollowersCountByChannel' })
	async findFollowersCountByChannel(@Args('channelId') channelId: string) {
		return this.channelService.findFollowersCountByChannel(channelId)
	}
}
