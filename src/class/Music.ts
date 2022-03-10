import { Node as MusicClient } from 'lavaclient';
import { container } from '@sapphire/framework';

export class NinoMusic extends MusicClient {
	constructor() {
		const { client } = container;
		super({
			sendGatewayPayload: (id, payload) => {
				client.guilds.cache.get(id)?.shard?.send(payload);
			},
			connection: {
				host: process.env.ip,
				password: process.env.pass,
				port: 25786,
				secure: false,
			},
		});
	}
}
