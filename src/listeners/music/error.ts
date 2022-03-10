import { Listener, container } from '@sapphire/framework';

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
			`${new Date().toLocaleString()}`.blue,
			`| Lavalink node "NinoLink" error: ${error}`
		);
	}
}
