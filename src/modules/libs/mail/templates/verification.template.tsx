import * as React from 'react'
import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Text } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface VerificationTemplateProps {
	domain: string
	token: string
}

const VerificationTemplate = (props: VerificationTemplateProps) => {
	const { domain, token } = props
	const verificationLink = `${domain}/account/verify?token=${token}`

	return (
		<Html>
			<Head />
			<Preview>
				Верификация аккаунта
			</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>
							Подтверждение вашей почты
						</Heading>
						<Text className='text-base text-black'>
							Спасибо за регистрацию в Streams! Чтобы подтвердить свой адрес электронной почты, пожалуйста, перейдите по следующей ссылке:
						</Text>
						<Link href={verificationLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
							Подтвердить почту
						</Link>
					</Section>

					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							Если у вас есть вопросы или вы столкнулись с трудностями, не стесняйтесь обращаться в нашу службу поддержки по адрусу {' '}
							<Link
								href="mailto:alex.gonchra@gmail.com"
								className="text-[#18b9ae] underline"
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

export default VerificationTemplate