import { container, Listener } from '@sapphire/framework';

export class errorNodeListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'error',
			emitter: container.client.music,
		});
	}

	run(error) {
		container.logger.error(`Lavalink node "NinoLink" error: ${error}`);
	}
}
