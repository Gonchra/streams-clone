import { Inject, Injectable } from '@nestjs/common'
import {
	IngressClient,
	RoomServiceClient,
	WebhookReceiver
} from 'livekit-server-sdk'

import {
	LiveKitOptionsSymbol,
	type TypeLiveKitOptions
} from './types/livekit.types'

@Injectable()
export class LivekitService {
	private roomService: RoomServiceClient
	private ingressClient: IngressClient
	private webhookReceiver: WebhookReceiver

	constructor(
		@Inject(LiveKitOptionsSymbol)
		private readonly options: TypeLiveKitOptions
	) {
		this.roomService = new RoomServiceClient(
			options.apiUrl,
			options.apiKey,
			options.apiSecret
		)

		this.ingressClient = new IngressClient(options.apiUrl)

		this.webhookReceiver = new WebhookReceiver(
			options.apiKey,
			options.apiSecret
		)
	}

	get room(): RoomServiceClient {
		return this.createProxy(this.roomService)
	}

	get ingress(): IngressClient {
		return this.createProxy(this.ingressClient)
	}

	get receiver(): WebhookReceiver {
		return this.createProxy(this.webhookReceiver)
	}

	private createProxy<T extends object>(target: T) {
		return new Proxy(target, {
			get: (obj, prop) => {
				const value = obj[prop as keyof T]

				if (typeof value === 'function') {
					return value.bind(obj)
				}

				return value
			}
		})
	}
}
