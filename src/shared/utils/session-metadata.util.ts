import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import countries from 'i18n-iso-countries'

import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util'

const DeviceDetector = require('device-detector-js')

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

export function getSessionMetadata(
	request: Request,
	userAgent: string
): SessionMetadata {
	const ip = IS_DEV_ENV
		? '173.166.164.121'
		: Array.isArray(request.headers['cf-connecting-ip'])
			? request.headers['cf-connecting-ip'][0]
			: (request.headers['cf-connecting-ip'] ??
				(typeof request.headers['x-forwarded-for'] === 'string'
					? request.headers['x-forwarded-for'].split(',')[0]
					: request.ip) ??
				'0.0.0.0')

	const location = ip ? lookup(ip) : null

	const device = new DeviceDetector().parse(userAgent)

	return {
		location: {
			country:
				countries.getName(location?.country ?? '', 'en') ||
				'Неизвестно',
			city: location?.city || 'Неизвестно',
			latitude: location?.ll[0] || 0,
			longitude: location?.ll[1] || 0
		},
		device: {
			browser: device.client.name,
			os: device.os.name,
			type: device.device.type
		},
		ip
	}
}
