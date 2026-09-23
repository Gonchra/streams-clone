import * as React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Text } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import { Html } from '@react-email/html'

const VerifyChannelTemplate = () => {

	return (
		<Html>
			<Head />
			<Preview>
				Ваш канал верифицирован
			</Preview>
			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Поздравляем! Ваш канал верифицирован
						</Heading>
						<Text className="text-black text-base mt-2">
							Мы рады сообщить, что ваш канал теперь верифицирован, и вы получили официальный значок.
						</Text>
					</Section>

					<Section className="bg-white rounded-lg p-6 text-center shadow-md mb-6">
						<Text className="text-black text-2xl font-semibold">Что это значит?</Text>
						<Text className="text-black">Значок верификации подтверждает подлинность вашего канала и улучшает доверие зрителей.</Text>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-black">
							Если у вас возникли вопросы, обращайтесь в службу поддержки по адресу{' '}
							<Link
								href="mailto:alex.gonchra@gmail.com"
								className="text-[#18B9AE] underline"
							>
								alex.gonchra@gmail.com
							</Link>
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default VerifyChannelTemplate