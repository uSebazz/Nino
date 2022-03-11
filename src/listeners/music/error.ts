import { Listener, container } from '@sapphire/framework';
import chalk from 'chalk';

export class errorNodeListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'error',
			emitter: container.client.music,
		});
	}

	run(error) {
		console.log(
			chalk.blue(`${new Date().toLocaleString()}`),
			`| Lavalink node "NinoLink" error: ${error}`
		);
	}
}
