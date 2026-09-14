import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Category } from '@prisma/generated/client'
import { StreamModel } from '@/src/modules/stream/models/stream.model'

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String, { nullable: true })
	thumbnailUrl: string

	@Field(() => String)
	slug: string

	@Field(() => String, { nullable: true })
	description: string

	@Field(() => [StreamModel])
	streams: StreamModel[]

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
