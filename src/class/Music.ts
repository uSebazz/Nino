import { Node as MusicClient } from 'lavaclient';
import { env } from '../lib/function/env';
import { load } from '@lavaclient/spotify';
import { container } from '@sapphire/framework';

load({
	client: {
		id: env.id,
		secret: env.secret,
	},
	autoResolveYoutubeTracks: true,
});

export class NinoMusic extends MusicClient {
	constructor() {
		const { client } = container;
		super({
			sendGatewayPayload: (id, payload) => {
				client.guilds.cache.get(id)?.shard?.send(payload);
			},
			connection: {
				host: env.ip,
				password: env.pass,
				port: 25786,
				secure: false,
			},
		});
	}
}
