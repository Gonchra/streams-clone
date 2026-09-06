import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator'

@InputType()
export class SocialLinkInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	title: string

	@Field(() => String)
	@IsString()
	@IsUrl()
	@IsNotEmpty()
	url: string
}

@InputType()
export class SocialLinkOrderInput {
	@Field(() => ID)
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	id: string

	@Field(() => Number)
	@IsNumber()
	@IsNotEmpty()
	position: number
}
