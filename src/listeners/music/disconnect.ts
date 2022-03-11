import { Listener, container } from '@sapphire/framework';
import chalk from 'chalk';

export class disconnectListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			name: 'disconnect',
			emitter: container.client.music,
		});
	}
	async run() {
		console.log(
			chalk.blue(new Date().toLocaleString()),
			'| Lavalink node "NinoLink" disconnected.'
		);
	}
}
