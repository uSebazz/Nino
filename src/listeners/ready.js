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
		console.log(`${new Date().toLocaleString()}`.blue, `| ${tag} is now On!`);
	}
}
