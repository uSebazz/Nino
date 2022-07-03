import { Emojis, rootFolder } from '#utils/constants'
import { minutes } from '#utils/function'
import type { StatcordOptions } from '@kaname-png/plugin-statcord/dist/lib/types'
import type { Prisma } from '@prisma/client'
import { BucketScope, container, LogLevel } from '@sapphire/framework'
import type { InternationalizationContext } from '@sapphire/plugin-i18next'
import type { LoggerFormatOptions } from '@sapphire/plugin-logger'
import { envParseArray, envParseString, setup } from '@skyra/env-utilities'
import { cyan, green, red, white, yellow } from 'colorette'
import type { ClientOptions, NewsChannel, TextChannel, ThreadChannel } from 'discord.js'
import { Options } from 'discord.js'
import { join } from 'node:path'

setup(join(rootFolder, 'src', '.env'))

export const testServer = ['951101886684082176']
export const OWNERS = envParseArray('CLIENT_OWNERS')

export const loggerOptions: LoggerFormatOptions = {
	trace: {
		timestamp: null,
		infix: white('[Trace]: 〢 ')
	},
	info: {
		timestamp: null,
		infix: cyan('[Info]: 〢 ')
	},
	debug: {
		timestamp: null,
		infix: green('[Debug]: 〢 ')
	},
	warn: {
		timestamp: null,
		infix: yellow('[Warn]: 〢 ')
	},
	error: {
		timestamp: null,
		infix: red('[Error]: 〢 ')
	},
	fatal: {
		timestamp: null,
		infix: red('[Fatal]: 〢 ')
	}
}

export const STAT_CORD_OPTIONS: StatcordOptions = {
	client_id: envParseString('CLIENT_ID'),
	key: envParseString('STATCORD_TOKEN'),
	autopost: false
}

export const CLIENT_OPTIONS: ClientOptions = {
	allowedMentions: { users: [], roles: [] },
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: ['n!', 'n?', 'n/', 'Nino', 'nakano'],
	loadDefaultErrorListeners: true,
	loadMessageCommandListeners: true,
	preventFailedToFetchLogForGuildIds: [
		'876339668956893216',
		'877560701416259625',
		'880099532417941524',
		'925909747994071111',
		'844856727517003818',
		'726505646073315408',
		'806611727684599838'
	],
	restTimeOffset: 0,
	shards: 'auto',
	partials: ['MESSAGE', 'CHANNEL', 'USER', 'GUILD_MEMBER'],
	sweepers: {
		...Options.defaultSweeperSettings,
		messages: {
			interval: minutes.toSeconds(3),
			lifetime: minutes.toSeconds(15)
		}
	},
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	],
	logger: {
		level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug,
		format: loggerOptions
	},
	presence: {
		activities: [
			{
				name: 'Estamos en mantenimiento, volvemos pronto 👍',
				type: 'WATCHING'
			}
		],
		status: 'idle'
	},
	statcord: STAT_CORD_OPTIONS,
	i18n: {
		fetchLanguage: async (context: InternationalizationContext) => {
			if (!context.guild) return 'en-US'

			let data = await container.prisma.serverConfig.findUnique({
				where: {
					guildId: context.guild.id
				}
			})
			let config: Prisma.ServerConfigCreateInput

			if (!data) {
				// eslint-disable-next-line @typescript-eslint/no-extra-semi
				;(config = {
					guildId: context.guild.id,
					lang: 'es-ES'
				}),
					(data = await container.prisma.serverConfig.create({
						data: config
					}))
			}

			return data.lang
		},
		i18next: {
			interpolation: {
				defaultVariables: {
					wrong: Emojis.wrong,
					right: Emojis.right,
					excl: Emojis.excl,
					netual: Emojis.netual,
					setting: Emojis.setting,
					ninoheart: Emojis.ninoheart,
					ninozzz: Emojis.ninozzz
				},
				escapeValue: false
			}
		},
		hmr: {
			enabled: true
		},
		defaultLanguageDirectory: join(rootFolder, 'src', 'languages')
	},
	defaultCooldown: {
		delay: 10_000, // 10s
		filteredUsers: OWNERS, // bot owners
		limit: 2, // Limit 2 commands for second
		scope: BucketScope.User // Scope User
	}
}

export type MessageChannel = TextChannel | ThreadChannel | NewsChannel | null
