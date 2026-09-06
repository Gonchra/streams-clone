import * as React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Text } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import { Html } from '@react-email/html'

interface AccountDeletionTemplateInterface {
	domain: string
}

const AccountDeletionTemplate = (props: AccountDeletionTemplateInterface) => {
	const { domain } = props
	const registerLink = `${domain}/account/create`

	return (
		<Html>
			<Head />
			<Preview>
				Аккаунт удалён
			</Preview>
			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Ваш аккаунт был полностью удалён
						</Heading>
						<Text className="text-black text-base mt-2">
							Ваш аккаунт был полностью стёрт из базы данных Streams. Все ваши данные и информация были
							удалены безвозвратно
						</Text>
					</Section>

					<Section className="bg-white rounded-lg p-6 text-center shadow-md mb-6">
						<Text className="text-black">Вы больше не будете получать уведомления в Telegram и на
							почту</Text>
						<Text className="text-black">Если вы захотите вернуться на платформу, вы можете
							зарегистрироваться по следующей ссылке:</Text>
						<Link
							href={registerLink}
							className="inline-flex justify-center items-center rounded-md mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
						>
							Зарегистрироваться на Streams
						</Link>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-black">
							Спасибо, что были с нами! Мы всегда будем рады видеть вас на платформе.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default AccountDeletionTemplate