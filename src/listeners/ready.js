import { Listener } from '@sapphire/framework';

export class ReadyListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: true,
			event: 'ready',
		});
	}
	run(client) {
		let { username, id } = client.user;
		console.log(`Ready in ${username} (${id})`);
	}
}
