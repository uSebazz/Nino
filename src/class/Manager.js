import { Manager } from 'erela.js';
import { container } from '@sapphire/framework';
import colors from 'colors';

export class NinoManager extends Manager {
	constructor() {
		const { client } = container;
		super({
			send: (id, payload) => {
				client.guilds.cache.get(id).shard.send(payload);
			},
			nodes: [
				{
					host: process.env.ip,
					identifier: 'Nino Testing Link',
					password: process.env.pass,
					port: 25786,
					secure: false,
				},
			],
		});
		this.on('nodeConnect', async (node) => {
			console.log(
				colors.blue(new Date().toLocaleString()),
				`| Lavalink node '${node.options.identifier}' connected.`
			);
		});
	}
}
