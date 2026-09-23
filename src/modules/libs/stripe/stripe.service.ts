import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'

import {
	StripeOptionsSymbol,
	type TypeStripeOptions
} from '@/src/modules/libs/stripe/types/stripe.types'

@Injectable()
export class StripeService extends Stripe {
	constructor(@Inject(StripeOptionsSymbol) options: TypeStripeOptions) {
		super(options.apiKey, options.config)
	}
}
