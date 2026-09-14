import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'

import { ChangeStreamInfoInput } from '@/src/modules/stream/inputs/change-stream-info.input'
import { FiltersInput } from '@/src/modules/stream/inputs/filters.input'
import { GenerateStreamTokenInput } from '@/src/modules/stream/inputs/generate-stream-token.input'
import { GenerateStreamTokenModel } from '@/src/modules/stream/models/generate-stream-token.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'
import { Authorization } from '@/src/shared/decorators/authorization.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { StreamService } from './stream.service'

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	async findAll(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input)
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	async findRandom() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInfoInput
	) {
		return this.streamService.changeInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	async changeThumbnail(
		@Authorized() user: User,
		@Args(
			'thumbnail',
			{
				type: () => GraphQLUpload
			},
			FileValidationPipe
		)
		thumbnail: Upload
	) {
		return this.streamService.changeThumbnail(user, thumbnail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user)
	}

	@Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
	async generateToken(@Args('data') input: GenerateStreamTokenInput) {
		return this.streamService.generateToken(input)
	}
}
