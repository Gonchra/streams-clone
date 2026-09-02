import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis {
	constructor(private readonly configService: ConfigService) {
		super({
			host: configService.getOrThrow<string>('REDIS_HOST'),
			port: Number(configService.getOrThrow<string>('REDIS_PORT')),
			password: configService.getOrThrow<string>('REDIS_PASSWORD')
		})
	}


}
