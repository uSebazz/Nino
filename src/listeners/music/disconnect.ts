import { Listener, container } from '@sapphire/framework';

export class disconnectListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			name: 'disconnect',
			emitter: container.client.music,
		});
	}
	async run() {
		console.log(new Date().toLocaleString().blue, '| Lavalink node "NinoLink" disconnected.');
	}
}
