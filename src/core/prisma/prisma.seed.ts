import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'argon2'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

import { PrismaClient } from '../../../prisma/generated/client'

//const PrismaClient = require('../../../prisma/generated/client')

expand(config())

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.POSTGRES_URI
	})
})

async function main() {
	try {
		Logger.log('Начало заполнения базы данных')

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany()
		])

		const categoriesData = [
			{
				title: 'Counter-Strike',
				slug: 'counter-strike',
				description:
					'Легендарный тактический шутер 5 на 5 от Valve. Соревновательные матчи и киберспорт.',
				thumbnailUrl: '/categories/counter-strike.webp'
			},
			{
				title: 'Общение',
				slug: 'just-chatting',
				description:
					'Общение со зрителями в реальном времени: разговоры, реакции, IRL-стримы.',
				thumbnailUrl: '/categories/just-chatting.webp'
			},
			{
				title: 'Dota 2',
				slug: 'dota-2',
				description:
					'MOBA от Valve с глубокой механикой, драфтами и профессиональной сценой.',
				thumbnailUrl: '/categories/dota-2.webp'
			},
			{
				title: 'League of Legends',
				slug: 'league-of-legends',
				description:
					'Стратегическая MOBA 5 на 5 от Riot Games. Рейтинговые матчи, турниры и обучающие стримы.',
				thumbnailUrl: '/categories/league-of-legends.webp'
			},
			{
				title: 'Grand Theft Auto V',
				slug: 'grand-theft-auto-v',
				description:
					'Криминальный экшен с открытым миром. Ролевые серверы, гонки и свободная игра.',
				thumbnailUrl: '/categories/grand-theft-auto-v.webp'
			},
			{
				title: 'Valorant',
				slug: 'valorant',
				description:
					'Тактический шутер 5 на 5 с уникальными агентами и способностями от Riot Games.',
				thumbnailUrl: '/categories/valorant.webp'
			},

			{
				title: 'Fortnite',
				slug: 'fortnite',
				description:
					'Королевская битва с строительством, кроссоверами и регулярными ивентами.',
				thumbnailUrl: '/categories/fortnite.webp'
			},
			{
				title: 'Minecraft',
				slug: 'minecraft',
				description:
					'Песочница с бесконечным миром. Выживание, креатив, модпаки и мини-игры.',
				thumbnailUrl: '/categories/minecraft.webp'
			},
			{
				title: 'Call of Duty: Warzone',
				slug: 'call-of-duty-warzone',
				description:
					'Бесплатная королевская битва от Activision в мире Call of Duty.',
				thumbnailUrl: '/categories/call-of-duty-warzone.webp'
			},
			{
				title: 'Apex Legends',
				slug: 'apex-legends',
				description:
					'Динамичная королевская битва с отрядами по три и уникальными легендами.',
				thumbnailUrl: '/categories/apex-legends.webp'
			},
			{
				title: 'World of Warcraft',
				slug: 'world-of-warcraft',
				description:
					'Классическая MMORPG от Blizzard: рейды, PvP и исследование Азерота.',
				thumbnailUrl: '/categories/world-of-warcraft.webp'
			},
			{
				title: 'Elden Ring',
				slug: 'elden-ring',
				description:
					'Экшен-RPG от FromSoftware в мире, созданном при участии Джорджа Мартина.',
				thumbnailUrl: '/categories/elden-ring.webp'
			},
			{
				title: 'Rust',
				slug: 'rust',
				description:
					'Хардкорный мультиплеерный сурвайвал с рейдами, крафтом и PvP.',
				thumbnailUrl: '/categories/rust.webp'
			},
			{
				title: 'Overwatch 2',
				slug: 'overwatch-2',
				description:
					'Командный шутер 5 на 5 с яркими героями и разными ролями.',
				thumbnailUrl: '/categories/overwatch-2.webp'
			},
			{
				title: 'Rocket League',
				slug: 'rocket-league',
				description:
					'Футбол на машинах с высокой механикой и киберспортивной сценой.',
				thumbnailUrl: '/categories/rocket-league.webp'
			},
			{
				title: 'Музыка',
				slug: 'music',
				description:
					'Музыкальные стримы: живые выступления, продакшн, DJ-сеты и разборы.',
				thumbnailUrl: '/categories/music.webp'
			},
			{
				title: 'Спорт',
				slug: 'sports',
				description:
					'Спортивные трансляции и обсуждения: футбол, баскетбол, MMA и другие дисциплины.',
				thumbnailUrl: '/categories/sports.webp'
			}
		]

		await prisma.category.createMany({
			data: categoriesData
		})

		Logger.log('Категории успешно созданы')

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category])
		)

		const streamTitles = {
			'counter-strike': [
				'Faceit Level 10 — путь к FPL',
				'Premier 25k+ рейтинг, го в топ',
				'Разбор демок с подписчиками',
				'Играем с чатом против сабов',
				'AWP only челлендж',
				'Киберспортивный прайм-тайм: смотрим матчи',
				'Rush B и не сдаёмся',
				'Смurf-детектор: ловим читеров',
				'Тренировка аима и смоков',
				'Катки с профиками, разбор ошибок'
			],
			'just-chatting': [
				'Утренний кофе с чатом',
				'Отвечаю на вопросы подписчиков',
				'Реакция на свежие новости',
				'Разговор по душам без темы',
				'IRL-прогулка по городу',
				'Обсуждаем жизнь и планы на будущее',
				'Чилл-стрим под музыку',
				'Истории из прошлого',
				'Пятничный вечер с чатом',
				'Читаю ваши донаты и истории'
			],
			'dota-2': [
				'Путь к Immortal: ммр вверх',
				'Мид или фид — катки на 10к',
				'Разбор реплеев сабов',
				'Смотрим The International вместе',
				'Смурф-охота в пабе',
				'Тренировка на керри-героях',
				'Квизы и конкурсы для зрителей',
				'Роллим героев и побеждаем',
				'Катки с чатом 5х5',
				'Аналитика меты патча'
			],
			'league-of-legends': [
				'Путь в Challenger: соло-кью',
				'Топ-лейн мейн, учимся играть',
				'Разбор ошибок подписчиков',
				'Смотрим LEC/LCK вместе',
				'АРАМ марафон с чатом',
				'Катки с сабами 5х5',
				'Мета-патч: что играть в новом сезоне',
				'Дуо с подписчиком',
				'Челлендж: только один чемпион',
				'Тренировка микро и макро'
			],
			'grand-theft-auto-v': [
				'RP-сервер: новая жизнь в Лос-Сантосе',
				'Гонки на выживание',
				'Ограбление века с бандой',
				'Ролевая игра: коп против бандита',
				'Свободная игра и троллинг',
				'Марафон миссий с чатом',
				'Копы и преступники: ивент',
				'Строим бизнес-империю',
				'Дрифт-челлендж',
				'РП с подписчиками на сервере'
			],
			valorant: [
				'Путь к Radiant: ранкед',
				'Разбор раундов с подписчиками',
				'Jett мейн, учимся летать',
				'Играем с чатом 5х5',
				'Смотрим VCT вместе',
				'Тренировка аима и line-up',
				'Челлендж: только пистолеты',
				'Смурф-детектор в ранкеде',
				'Стратегии на Ascent и Haven',
				'Катки с профиками'
			],
			fortnite: [
				'Соло vs сквады — выживаем',
				'Строим как профи',
				'Играем с чатом в дуо',
				'Новый сезон: разбор карты',
				'Челлендж: только пистолеты',
				'Смотрим ивент вместе',
				'Турнир на Victory Royale',
				'Реакция на новый скин',
				'Креатив-карты с подписчиками',
				'Ноу-билд марафон'
			],
			minecraft: [
				'Хардкор-выживание: день 1',
				'Строим мега-базу с чатом',
				'Спидран на дракона',
				'Модпак: новая эра',
				'Сервер с подписчиками',
				'Мини-игры: Bed Wars',
				'Строим копию Скайрима',
				'Хардкор: 100 дней выживания',
				'Смотрим сид и ищем деревню',
				'Редстоун-механизмы для новичков'
			],
			'call-of-duty-warzone': [
				'Сквады на победу: го за краской',
				'Соло vs трио — выживаем',
				'Новая карта: изучаем мету',
				'Играем с подписчиками',
				'Челлендж: только снайперка',
				'Разбор лучших билдов',
				'Ресёрдж-марафон',
				'Катки с профиками',
				'Топ-5 катки недели',
				'Реакция на патч'
			],
			'apex-legends': [
				'Путь к Predator: ранкед',
				'Играем с чатом в трио',
				'Разбор легенд и их абилок',
				'Челлендж: только Wraith',
				'Смотрим ALGS вместе',
				'Тренировка в стрельбище',
				'Катки с профиками',
				'Реакция на новый сезон',
				'Соло vs трио выживание',
				'Топ-1 или фид'
			],
			'world-of-warcraft': [
				'Рейд с гильдией: героик',
				'Прокачка нового персонажа',
				'PvP-арена: го за рейтингом',
				'Изучаем новый патч',
				'Соло-челлендж: хардкор',
				'Фарм маунтов и трансмога',
				'Рейд с подписчиками',
				'Классика vs Retail',
				'Мифик+ подземелья',
				'Истории Азерота для новичков'
			],
			'elden-ring': [
				'Первое прохождение: слепой забег',
				'No-hit челлендж',
				'Разбор лора и теорий',
				'PvP-арена с подписчиками',
				'Билд на мага: полный гайд',
				'Спидран до Малении',
				'Кооп с чатом',
				'Все боссы подряд',
				'Реакция на DLC',
				'Топ-10 самых сложных боссов'
			],
			rust: [
				'Вайп-день: строим базу',
				'Рейд на соседей',
				'Соло-выживание на сервере',
				'Клан против клана',
				'Фарм ресурсов и крафт',
				'PvP на монументах',
				'Оборона базы от рейда',
				'Играем с подписчиками',
				'Челлендж: только лук',
				'Смотрим вайп-ивент'
			],
			'overwatch-2': [
				'Путь к Grandmaster',
				'Играем с чатом 5х5',
				'Разбор героев и меты',
				'Смотрим OWL вместе',
				'Челлендж: только танки',
				'Тренировка аима и позиционирования',
				'Катки с профиками',
				'Реакция на новый сезон',
				'Ранкед марафон',
				'Лучшие комбо и ульты'
			],
			'rocket-league': [
				'Путь к Grand Champ',
				'Фристайл-тренировка',
				'Играем 2х2 с чатом',
				'Разбор механик для новичков',
				'Смотрим RLCS вместе',
				'Челлендж: только флипы',
				'Катки с профиками',
				'Турнир для подписчиков',
				'Реакция на новый сезон',
				'Топ-10 лучших голов недели'
			],
			music: [
				'Живой акустический сет',
				'DJ-сет на вечер',
				'Разбор любимых треков',
				'Создаём бит с нуля',
				'Караоке с чатом',
				'Реакция на новинки',
				'Учимся играть на гитаре',
				'Лоу-фай для учёбы',
				'Топ-100 недели',
				'Заявки от подписчиков'
			],
			sports: [
				'Смотрим матч вместе',
				'Разбор тура и прогнозы',
				'Обсуждаем трансферы',
				'Топ-10 голов недели',
				'Реакция на главный бой',
				'Аналитика тактики команд',
				'Прогнозы на выходные',
				'Истории из мира спорта',
				'Смотрим Олимпиаду',
				'Дискуссия с чатом: кто лучший'
			]
		}

		const usernames = [
			'xXShadowKillerXx',
			'NeonVortex',
			'FrostByte',
			'DarkPhoenix',
			'CyberWolf',
			'StormBreaker',
			'NightRaven',
			'IronFist',
			'PhantomEdge',
			'QuantumLeap',
			'BlazeRunner',
			'SilentArrow',
			'ThunderClap',
			'CrimsonBlade',
			'GhostProtocol',
			'TitanFall',
			'ViperStrike',
			'EchoChamber',
			'NovaBlast',
			'ZeroGravity',
			'PixelWizard',
			'TurboSnail',
			'MadPenguin',
			'LazyPanda',
			'AngryPotato',
			'SneakyFox',
			'HappyLlama',
			'GrumpyCat',
			'DancingBear',
			'ChillWolf',
			'WildTiger',
			'SilverHawk',
			'GoldenEagle',
			'RedDragon',
			'BlueWhale',
			'GreenGoblin',
			'PurpleHaze',
			'BlackMamba',
			'WhiteFang',
			'IronMan',
			'SpiderByte',
			'BatStorm',
			'SuperNova',
			'MegaTron',
			'UltraViolet',
			'HyperDrive',
			'RetroGamer',
			'PixelPunk',
			'SynthWave',
			'LoFiBeats',
			'BassDropper',
			'BeatMaster',
			'SoundWave',
			'EchoEcho',
			'VibeCheck',
			'MoodSwinger',
			'ChillVibes',
			'ZenMaster',
			'YogaFlame',
			'MeditationPro',
			'SpeedDemon',
			'TurboCharged',
			'NitroBoost',
			'DriftKing',
			'RallyRacer',
			'TrackStar',
			'MarathonMan',
			'SprintKing',
			'JumpShot',
			'DunkMaster',
			'ThreePointer',
			'SlamDunk',
			'GoalKeeper',
			'StrikerPro',
			'MidfieldMaestro',
			'DefenderWall',
			'CaptainClutch',
			'ClutchGod',
			'AceOfSpades',
			'RoyalFlush',
			'JackOfAllTrades',
			'KingOfHearts',
			'QueenOfDiamonds',
			'JokerCard',
			'WildCard',
			'GameChanger',
			'MetaBreaker',
			'TrendSetter',
			'StyleIcon',
			'FashionKing',
			'GlamQueen',
			'StarGazer',
			'MoonWalker',
			'SunChaser',
			'CloudSurfer',
			'SkyDiver',
			'DeepDiver',
			'OceanExplorer',
			'MountainClimber',
			'TrailBlazer',
			'PathFinder'
		]

		await prisma.$transaction(
			async tx => {
				for (const username of usernames) {
					const randomCategory =
						categoriesBySlug[
							Object.keys(categoriesBySlug)[
								Math.floor(
									Math.random() *
										Object.keys(categoriesBySlug).length
								)
							]
						]

					const userExists = await tx.user.findUnique({
						where: {
							username
						}
					})

					if (!userExists) {
						const createdUser = await tx.user.create({
							data: {
								email: `${username}@streams.com`,
								password: await hash('12345678'),
								username,
								displayName: username,
								avatar: `/channels/${username}.webp`,
								isEmailVerified: true,
								socialLinks: {
									createMany: {
										data: [
											{
												title: 'Telegram',
												url: `https://t.me/${username}`,
												position: 1
											},
											{
												title: 'YouTube',
												url: `https://youtube.com/${username}`,
												position: 2
											}
										]
									}
								}
							}
						})
						const randomTitles = streamTitles[randomCategory.slug]
						const randomTitle =
							randomTitles[
								Math.floor(Math.random() * randomTitles.length)
							]

						await tx.stream.create({
							data: {
								title: randomTitle,
								thumbnailUrl: `/streams/${createdUser.username}.webp`,
								user: {
									connect: {
										id: createdUser.id
									}
								},
								category: {
									connect: {
										id: randomCategory.id
									}
								}
							}
						})

						Logger.log(
							`Пользователь "${createdUser.username}" и его стрим успешно созданы`
						)
					}
				}
			},
			{ timeout: 60000, maxWait: 10000 }
		)

		Logger.log(`Заполнение базы даныых завершено успешно`)
	} catch (err) {
		Logger.error(err)
		throw new BadRequestException('Ошибка при заполнении базы данных')
	} finally {
		Logger.log('Закрытие соединения с базой данных...')
		await prisma.$disconnect()
		Logger.log('Соединение с базой данных успешно закрыто')
	}
}

main()
