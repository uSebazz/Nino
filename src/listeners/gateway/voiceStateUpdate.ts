import { Listener } from '@sapphire/framework';

export class VoiceStateUpdateListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			emitter: 'ws',
			event: 'VOICE_STATE_UPDATE',
		});
	}
	async run(data) {
		const { client } = this.container;

		client.music.handleVoiceUpdate(data);
	}
}
