import { gray, blue, green, yellow, red, bgRed } from '@colors/colors'
import { rootFolder } from '#utils/constans'
import { minutes } from '#utils/function/times'
import { BucketScope, container, LogLevel } from '@sapphire/framework'
import { Options } from 'discord.js'
import { join } from 'node:path'
import { envParseArray, envParseString, setup } from '@skyra/env-utilities'
import type { InternationalizationContext } from '@sapphire/plugin-i18next'
import type { LoggerFormatOptions } from '@sapphire/plugin-logger'
import type { NewsChannel, TextChannel, ThreadChannel, ClientOptions } from 'discord.js'
import type { Prisma } from '@prisma/client'

setup(join(rootFolder, 'src', '.env'))

export const testServer = ['951101886684082176']
export const OWNERS = envParseArray('CLIENT_OWNERS')

export const loggerOptions: LoggerFormatOptions = {
	trace: {
		timestamp: null,
		infix: gray('[Trace]: ')
	},
	info: {
		timestamp: null,
		infix: blue('[Info]: ')
	},
	debug: {
		timestamp: null,
		infix: green('[Debug]: ')
	},
	warn: {
		timestamp: null,
		infix: yellow('[Warn]: ')
	},
	error: {
		timestamp: null,
		infix: red('[Error]: ')
	},
	fatal: {
		timestamp: null,
		infix: bgRed('[Fatal]: ')
	}
}

export const CLIENT_OPTIONS: ClientOptions = {
	allowedMentions: { users: [], roles: [] },
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: ['.', 'n!', 'n?', 'n/', 'Nino', 'puta'],
	loadDefaultErrorListeners: false,
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
				name: '🌸 inv.nino.fun | dc.nino.fun',
				type: 'WATCHING'
			}
		],
		status: 'idle'
	},
	i18n: {
		fetchLanguage: async (context: InternationalizationContext) => {
			if (!context.guild) return 'en-US'

			let data = await container.prisma.config.findUnique({
				where: {
					guildId: context.guild.id
				}
			})
			let config: Prisma.ConfigCreateInput

			if (!data) {
				(config = {
					guildId: context.guild.id,
					lang: 'es-ES'
				}),
					(data = await container.prisma.config.create({ data: config }))
			}

			return data.lang
		}
	},
	defaultCooldown: {
		delay: 10_000,
		filteredUsers: OWNERS,
		limit: 2,
		scope: BucketScope.Channel
	}
}

export type MessageChannel = TextChannel | ThreadChannel | NewsChannel | null
