import { Model, defaultData } from './lib/database/guildConfig'
import { minutes } from './lib/function/times'
import { Logger } from './lib/logger/logger'
import { LogLevel } from '@sapphire/framework'
import { Options, type ClientOptions } from 'discord.js'
import type { InternationalizationContext } from '@sapphire/plugin-i18next'
import type { NewsChannel, TextChannel, ThreadChannel } from 'discord.js'

export const testServer: string[] = ['951101886684082176']

export const clientOptions: ClientOptions = {
	allowedMentions: { users: [], roles: [] },
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: 'n!',
	loadDefaultErrorListeners: false,
	loadMessageCommandListeners: true,
	preventFailedToFetchLogForGuildIds: [
		'876339668956893216',
		'877560701416259625',
		'880099532417941524',
		'925909747994071111',
		'844856727517003818',
		'726505646073315408',
		'806611727684599838',
	],
	restTimeOffset: 0,
	shards: 'auto',
	partials: ['MESSAGE', 'CHANNEL', 'USER', 'GUILD_MEMBER'],
	sweepers: {
		...Options.defaultSweeperSettings,
		messages: {
			interval: minutes.toSeconds(3),
			lifetime: minutes.toSeconds(15),
		},
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
		'DIRECT_MESSAGE_REACTIONS',
	],
	logger: {
		instance: new Logger({
			level: LogLevel.Info,
		}),
	},
	presence: {
		activities: [
			{
				name: '🌸 inv.nino.fun | dc.nino.fun',
				type: 'WATCHING',
			},
		],
		status: 'idle',
	},
	i18n: {
		fetchLanguage: async (context: InternationalizationContext) => {
			if (!context.guild) return 'en-US'

			let guild = await Model.findOne({ guild: context.guild.id }).lean()
			if (!guild) guild = await Model.create(defaultData(context.guild.id))
			return guild.config.language
		},
	},
}

export type MessageChannel = TextChannel | ThreadChannel | NewsChannel | null
