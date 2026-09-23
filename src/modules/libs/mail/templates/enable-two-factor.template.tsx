import * as React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Text } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import { Html } from '@react-email/html'

interface EnableTwoFactorTemplateProps {
	domain: string
}

const EnableTwoFactorTemplate = (props: EnableTwoFactorTemplateProps) => {
	const { domain } = props
	const settingsLink = `${domain}/dashboard/settings`

	return (
		<Html>
			<Head />
			<Preview>
				Обеспечьте свою безопасность
			</Preview>
			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Защитите свой аккаунт с двухфакторной аутентификацией
						</Heading>
						<Text className="text-black text-base mt-2">
							Включите двухфакторную аутентификацию, чтобы повысить безопасность вашего аккаунта.
						</Text>
					</Section>

					<Section className="bg-white rounded-lg p-6 text-center shadow-md mb-6">
						<Text className="text-black text-2xl font-semibold">Почему это важно</Text>
						<Text className="text-black">Двухфакторная аутентификация добавляет дополнительный уровень
							защиты, требуя код, который известен только вам.</Text>
						<Link
							href={settingsLink}
							className="inline-flex justify-center items-center text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
						>
							Перейти в настройки аккаунта
						</Link>
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

export default EnableTwoFactorTemplate