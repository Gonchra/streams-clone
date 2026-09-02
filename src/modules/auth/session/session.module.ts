import { Module } from '@nestjs/common'

import { VerificationModule } from '@/src/modules/auth/verification/verification.module'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
	imports: [VerificationModule],
	providers: [SessionResolver, SessionService]
})
export class SessionModule {}
