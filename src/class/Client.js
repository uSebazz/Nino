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
import { NinoManager } from './Manager.js';

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
			retryLimit: 2,
			disableMentions: 'everyone',
			fetchAllMembers: true,
			allowedMentions: { repliedUser: false },
			defaultPrefix: 'n/',
			loadMessageCommandListeners: true,
		});
		this.devs = ['899339781132124220', '762143188655144991', '752336035228418059'];
		this.manager = new NinoManager(this);
	}
	async login(token = process.env.token) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
		await super.login(token);
	}
}
