import { Node as MusicClient } from 'lavaclient';
import { container } from '@sapphire/framework';
import colors from 'colors';

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
		this.on('connect', async (node) => {
			console.log(
				colors.blue(new Date().toLocaleString()),
				`| Lavalink node "NinoLink" connected.`
			);
		});
		this.on('disconnect', async () => {
			console.log(
				colors.blue(new Date().toLocaleString()),
				'| Lavalink node "NinoLink" disconnected.'
			);
		});

		this.on('error', async (error) => {
			console.log(
				colors.blue(`${new Date().toLocaleString()}`),
				`| Lavalink node "NinoLink" error: ${error}`
			);
		});
	}
}
