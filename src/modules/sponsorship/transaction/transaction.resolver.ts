import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

import { MakePaymentModel } from '@/src/modules/sponsorship/transaction/models/make-payment.model'
import { TransactionModel } from '@/src/modules/sponsorship/transaction/models/transaction.model'
import { Authorization } from '@/src/shared/decorators/authorization.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { TransactionService } from './transaction.service'

@Resolver('Transaction')
export class TransactionResolver {
	constructor(private readonly transactionService: TransactionService) {}

	@Authorization()
	@Query(() => [TransactionModel], { name: 'findMyTransactions' })
	async findMyTransactions(@Authorized() user: User) {
		return this.transactionService.findMyTransactions(user)
	}

	@Authorization()
	@Mutation(() => MakePaymentModel, { name: 'makePayment' })
	async makePayment(
		@Authorized() user: User,
		@Args('planId') planId: string
	) {
		return this.transactionService.makePayment(user, planId)
	}
}
