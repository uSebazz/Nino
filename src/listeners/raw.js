import { Listener } from '@sapphire/framework';

export class RawListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			event: 'raw',
		});
	}
	async run(d) {
		const { client } = this.container;

		client.manager.updateVoiceState(d);
	}
}
