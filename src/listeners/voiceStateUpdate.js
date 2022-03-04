import { Listener } from '@sapphire/framework';

export class VoiceStateUpdateListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			emitter: 'ws',
			event: 'VOICE_STATE_UPDATE',
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
