import { Module } from '@nestjs/common'

import { TelegramService } from '@/src/modules/libs/telegram/telegram.service'

import { DeactivateResolver } from './deactivate.resolver'
import { DeactivateService } from './deactivate.service'

@Module({
	providers: [DeactivateResolver, DeactivateService, TelegramService]
})
export class DeactivateModule {}
