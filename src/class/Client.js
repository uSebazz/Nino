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
import { NinoMusic } from './Music.js';
import { Model, defaultData } from '../lib/database/guildConfig.js';

await mongoose
	.connect(process.env.mongourl)
	.then(() => console.log(colors.blue(`${new Date().toLocaleString()}`), `| Mongoose Connected`));

export class Nino extends SapphireClient {
	constructor() {
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
				fetchLanguage: async (context) => {
					if (!context.guild) return 'en-US';

					let guild = await Model.findOne({ guild: context.guild.id }).lean();
					if (!guild) guild = await Model.create(defaultData(context.guild.id));
					return guild.config.language;
				},
			},
			retryLimit: 2,
			disableMentions: 'everyone',
			fetchAllMembers: true,
			allowedMentions: { repliedUser: false },
			defaultPrefix: 'n/',
			loadMessageCommandListeners: true,
		});
		this.devs = ['899339781132124220', '762143188655144991', '752336035228418059'];
		this.music = new NinoMusic(this);
	}
	async login(token = process.env.token) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
		await super.login(token);
	}
}
