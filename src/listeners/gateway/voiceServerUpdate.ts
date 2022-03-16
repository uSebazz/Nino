import { Listener } from '@sapphire/framework';

export class VoiceServerUpdateListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			emitter: 'ws',
			event: 'VOICE_SERVER_UPDATE',
		});
	}
	async run(data: never) {
		const { client } = this.container;

		client.music.handleVoiceUpdate(data);
	}
}
