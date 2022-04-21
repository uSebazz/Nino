import '@sapphire/plugin-i18next/register'
import {
	ApplicationCommandRegistries,
	container,
	LogLevel,
	RegisterBehavior,
	SapphireClient,
} from '@sapphire/framework'
import { Model, defaultData } from '../lib/database/guildConfig'
import { connect, connection } from 'mongoose'
import { load } from '@lavaclient/queue'
import { NinoMusic } from './music'
import { Logger } from '../lib/logger/logger'
import { env } from '../lib/function/env'
import type { NewsChannel, TextChannel, ThreadChannel } from 'discord.js'
import type { InternationalizationContext } from '@sapphire/plugin-i18next'
;(async () => {
	await connect(env.MONGO_URL).then(() => {
		container.logger.info(
			`Mongoose connection established successfully at ${connection.readyState}ms`
		)
	})
})().catch((e) => container.logger.error(e))

export class Nino extends SapphireClient {
	public override music: NinoMusic
	public constructor() {
		super({
			defaultPrefix: 'n!',
			loadMessageCommandListeners: true,
			allowedMentions: { repliedUser: false },
			i18n: {
				fetchLanguage: async (context: InternationalizationContext) => {
					if (!context.guild) return 'en-US'

					let guild = await Model.findOne({ guild: context.guild.id }).lean()
					if (!guild) guild = await Model.create(defaultData(context.guild.id))
					return guild.config.language
				},
			},
			intents: 16071,
			logger: {
				instance: new Logger({
					level: LogLevel.Debug,
				}),
			},
			partials: [
				'MESSAGE',
				'CHANNEL',
				'USER',
				'GUILD_MEMBER',
				'GUILD_SCHEDULED_EVENT',
				'REACTION',
			],
			presence: {
				activities: [
					{
						name: '🌸 inv.nino.fun | dc.nino.fun',
						type: 'WATCHING',
					},
				],
				status: 'idle',
			},
			retryLimit: 2,
		})
		this.music = new NinoMusic()
	}

	public async start(token?: string): Promise<void> {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
			RegisterBehavior.Overwrite
		)
		load()
		await super.login(token)
	}
}

export type MessageChannel = TextChannel | ThreadChannel | NewsChannel | null

declare module '@sapphire/framework' {
	export interface SapphireClient {
		readonly music: NinoMusic
	}
	export interface Preconditions {
		inVoiceChannel: never
		ownerOnly: never
		channelSpeak: never
		channelJoin: never
		channelView: never
		channelFull: never
	}
}

declare module '@lavaclient/queue' {
	interface Queue {
		channel: MessageChannel
	}
}
