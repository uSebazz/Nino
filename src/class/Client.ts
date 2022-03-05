import 'dotenv/config';
import '@sapphire/plugin-i18next/register';
import mongoose from 'mongoose';
import colors from 'colors';
import {
	SapphireClient,
	ApplicationCommandRegistries,
	RegisterBehavior,
	LogLevel,
} from '@sapphire/framework';
import { InternationalizationContext } from '@sapphire/plugin-i18next';
import { NinoMusic } from './Music';
import { Model, defaultData } from '../lib/database/guildConfig';

mongoose.connect(process.env.mongurl).then(() => {
	console.log(colors.blue(`${new Date().toLocaleString()}`), '| Mongoose Connected');
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
			logger: {
				level: LogLevel.Debug,
			},
			i18n: {
				fetchLanguage: async (context: InternationalizationContext) => {
					if (!context.guild) return 'en-US';

					let guild = await Model.findOne({ guild: context.guild.id }).lean();
					if (!guild) guild = await Model.create(defaultData(context.guild.id));
					return guild.config.language;
				},
			},
			retryLimit: 2,
			allowedMentions: { repliedUser: false },
			defaultPrefix: 'n/',
			loadMessageCommandListeners: true,
		});
		this.music = new NinoMusic();
	}
	async start(token: string) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
		await super.login(token);
	}
}

declare module '@sapphire/framework' {
	interface SapphireClient {
		readonly music: NinoMusic;
	}
}
