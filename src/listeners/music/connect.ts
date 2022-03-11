import { Listener, container } from '@sapphire/framework';
import chalk from 'chalk';

export class connectNodeListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'connect',
			emitter: container.client.music,
		});
	}

	run() {
		console.log(chalk.blue(new Date().toLocaleString()), `| Lavalink node "NinoLink" connected.`);
	}
}
