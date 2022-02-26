import { SapphireClient } from '@sapphire/framework';
import 'dotenv/config';

export class Nino extends SapphireClient {
	constructor() {
		super({
			disableMentions: 'everyone',
			fetchAllMembers: false,
			allowedMentions: { repliedUser: false },
			intents: 16071,
			partials: ['MESSAGE', 'CHANNEL', 'USER', 'GUILD_MEMBER'],
			defaultPrefix: 'n/',
		});
	}
    async log(token = process.env.token) {
        this.login(token)
    }
}
