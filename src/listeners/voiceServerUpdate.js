import { Listener } from '@sapphire/framework';

export class VoiceServerUpdateListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			emitter: 'ws',
			event: 'VOICE_SERVER_UPDATE',
		});
	}
	async run(data) {
		/**
		 * @type {import('../class/Client').Nino}
		 */
		const client = this.container.client;

		client.music.handleVoiceUpdate(data);
	}
}
