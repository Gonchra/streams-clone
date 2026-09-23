import { DynamicModule, Module } from '@nestjs/common'

import {
	StripeOptionsSymbol, TypeStripeAsyncOptions,
	TypeStripeOptions
} from '@/src/modules/libs/stripe/types/stripe.types'

import { StripeService } from './stripe.service'

@Module({})
export class StripeModule {
	static forRoot(options: TypeStripeOptions): DynamicModule {
		return {
			module: StripeModule,
			providers: [
				{
					provide: StripeOptionsSymbol,
					useValue: options
				},
				StripeService
			],
			exports: [StripeService],
			global: true
		}
	}

	static forRootAsync(options: TypeStripeAsyncOptions): DynamicModule {
		return {
			module: StripeModule,
			imports: options.imports || [],
			providers: [
				{
					provide: StripeOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || []
				},
				StripeService
			],
			exports: [StripeService],
			global: true,

		}
	}
}
