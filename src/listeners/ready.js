import { Listener } from '@sapphire/framework';
import colors from 'colors';

export class ReadyListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: true,
			event: 'ready',
		});
	}
	async run(client) {
		let { tag } = client.user;
		client.manager.init(client.user.id);
		console.log(colors.blue(`${new Date().toLocaleString()}`), `| ${tag} is now On!`);
	}
}
