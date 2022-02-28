import {
	SapphireClient,
	ApplicationCommandRegistries,
	RegisterBehavior,
} from '@sapphire/framework';
import { emotes } from '../lib/emotes.js';
import 'dotenv/config';

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
			retryLimit: 2,
			disableMentions: 'everyone',
			fetchAllMembers: true,
			allowedMentions: { repliedUser: false },
			defaultPrefix: 'n/',
		});
		this.emotes = emotes;
		this.devs = ['899339781132124220', '762143188655144991', '752336035228418059'];
	}
	async login(token = process.env.token) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
		await super.login(token);
	}
}
