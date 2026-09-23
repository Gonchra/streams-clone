import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { TelegramService } from '@/src/modules/libs/telegram/telegram.service'
import { NotificationService } from '@/src/modules/notification/notification.service'

import { CronService } from './cron.service'

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [CronService, TelegramService, NotificationService]
})
export class CronModule {}
