import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

export const UserAgent = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		if (context.getType() === 'http') {
			const request = context.switchToHttp().getRequest()

			return request.headers['user-agent']
		} else {
			const ctx = GqlExecutionContext.create(context)

			return ctx.getContext().req.headers['user-agent']
		}
	}
)
