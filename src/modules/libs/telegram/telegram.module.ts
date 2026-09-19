import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'

import { getTelegrafConfig } from '@/src/core/config/telegraf.config'

import { TelegramService } from './telegram.service'

@Module({
	imports: [
		TelegrafModule.forRootAsync({
			useFactory: getTelegrafConfig,
			inject: [ConfigService],
			imports: [ConfigModule]
		})
	],
	providers: [TelegramService]
})
export class TelegramModule {}
