import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { TelegramService } from '@/src/modules/libs/telegram/telegram.service'

import { CronService } from './cron.service'

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [CronService, TelegramService]
})
export class CronModule {}
