import { Injectable } from '@nestjs/common'
import { User } from '@prisma/generated/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class SubscriptionService {
	constructor(private readonly prismaService: PrismaService) {}

	async findMySponsors(user: User) {
		const sponsors =
			await this.prismaService.sponsorshipSubscription.findMany({
				where: {
					channelId: user.id
				},
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					user: true,
					plan: true,
					channel: true
				}
			})

		return sponsors
	}
}
