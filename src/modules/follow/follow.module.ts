import { Module } from '@nestjs/common'

import { TelegramService } from '@/src/modules/libs/telegram/telegram.service'
import { NotificationService } from '@/src/modules/notification/notification.service'

import { FollowResolver } from './follow.resolver'
import { FollowService } from './follow.service'

@Module({
	providers: [
		FollowResolver,
		FollowService,
		NotificationService,
		TelegramService
	]
})
export class FollowModule {}
