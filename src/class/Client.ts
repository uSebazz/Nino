import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';
import mongoose from 'mongoose';
import {
	SapphireClient,
	ApplicationCommandRegistries,
	RegisterBehavior,
	LogLevel,
	container,
} from '@sapphire/framework';
import type { TextChannel, ThreadChannel, NewsChannel, TextBasedChannel } from 'discord.js';
import { InternationalizationContext } from '@sapphire/plugin-i18next';
import { Model, defaultData } from '../lib/database/guildConfig';
import { NinoMusic } from './Music';
import { env } from '../lib/function/env';
import { load } from '@lavaclient/queue';

mongoose.connect(env.mongourl).then(() => {
	container.logger.info(`Mongoose connection established successfully at ${mongoose.connection.readyState}ms`);
});

export class Nino extends SapphireClient {
	readonly music: NinoMusic;
	public constructor() {
		super({
			intents: 16071,
			partials: [
				'MESSAGE',
				'CHANNEL',
				'USER',
				'GUILD_MEMBER',
				'GUILD_SCHEDULED_EVENT',
				'REACTION',
			],
			presence: {
				status: 'idle',
				activities: [
					{
						name: '🌸 inv.nino.fun | dc.nino.fun',
						type: 'WATCHING',
					},
				],
			},
			i18n: {
				fetchLanguage: async (context: InternationalizationContext) => {
					if (!context.guild) return 'en-US';

					let guild = await Model.findOne({ guild: context.guild.id }).lean();
					if (!guild) guild = await Model.create(defaultData(context.guild.id));
					return guild.config.language;
				},
			},
			logger: {
				level: LogLevel.Debug,
			},
			retryLimit: 2,
			allowedMentions: { repliedUser: false },
			defaultPrefix: 'n/',
		});
		this.music = new NinoMusic();
	}
	async start(token: string) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
		load();
		await super.login(token);
	}
}

export type MessageChannel = TextBasedChannel | TextChannel | ThreadChannel | NewsChannel | null;

declare module '@sapphire/framework' {
	export interface SapphireClient {
		readonly music: NinoMusic;
	}
	export interface Preconditions {
		inVoiceChannel: never;
		OwnerOnly: never;
	}
}

declare module '@lavaclient/queue' {
	interface Queue {
		channel: MessageChannel;
	}
}
