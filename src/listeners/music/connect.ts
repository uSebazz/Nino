import { Listener, container } from '@sapphire/framework';

export class connectNodeListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'connect',
			emitter: container.client.music,
		});
	}

	run() {
		console.log(new Date().toLocaleString().blue, `| Lavalink node "NinoLink" connected.`);
	}
}
