import { container, Listener } from '@sapphire/framework';

export class trackStartListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'trackStart',
			emitter: container.client.music,
		});
	}
	run(track: string) {}
}
