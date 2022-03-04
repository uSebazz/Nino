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
	async run() {
		/**
		 * @type {import('../class/Client').Nino}
		 */
		const client = this.container.client;

		let { tag } = client.user;
		client.music.connect(client.user.id);
		console.log(colors.blue(`${new Date().toLocaleString()}`), `| ${tag} is now On!`);
	}
}
