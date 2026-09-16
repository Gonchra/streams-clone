import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import { PubSub } from 'graphql-subscriptions'

import { ChangeChatSettingsInput } from '@/src/modules/chat/inputs/change-chat-settings.input'
import { SendMessageInput } from '@/src/modules/chat/inputs/send-message.input'
import { ChatMessageModel } from '@/src/modules/chat/model/chat-message.model'
import { Authorization } from '@/src/shared/decorators/authorization.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { ChatService } from './chat.service'

@Resolver('Chat')
export class ChatResolver {
	private readonly pubSub: PubSub

	constructor(private readonly chatService: ChatService) {
		this.pubSub = new PubSub()
	}

	@Query(() => [ChatMessageModel], { name: 'findChatMessageByStream' })
	async findMessagesByStream(@Args('streamId') streamId: string) {
		return this.chatService.findMessagesByStream(streamId)
	}

	@Authorization()
	@Mutation(() => ChatMessageModel, { name: 'sendChatMessage' })
	async sendMessage(
		@Authorized('id') userId: string,
		@Args('data') input: SendMessageInput
	) {
		const message = await this.chatService.sendMessage(userId, input)

		this.pubSub.publish('CHAT_MESSAGE_ADDED', {
			chatMessageAdded: message
		})

		return message
	}

	@Subscription(() => ChatMessageModel, {
		name: 'chatMessageAdded',
		filter: (payload, variables) =>
			payload.chatMessageAdded.streamId === variables.streamId
	})
	chatMessageAdded(@Args('streamId') streamId: string) {
		return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeChatSettings' })
	async changeSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeChatSettingsInput
	) {
		return this.chatService.changeSettings(user, input)
	}
}
