import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

export const Authorized = createParamDecorator(
	(data: keyof User, context: ExecutionContext) => {
		let user: User

		if (context.getType() === 'http') {
			user = context.switchToHttp().getRequest().user
		} else {
			const ctx = GqlExecutionContext.create(context)
			const request = ctx.getContext().req
			user = request.user
		}

		return data ? user[data] : user
	}
)
