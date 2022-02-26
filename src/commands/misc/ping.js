import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class PingCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'ping',
			aliases: ['pong'],
			description: 'ping pong',
		});
	}
	/**
	 *
	 * @param {Message} message
	 * @returns
	 */
	async messageRun(message) {
		const msg = await message.channel.send('Pong...');
		const content = `(Latency: ${Math.round(this.container.client.ws.ping)}ms.) (API Latency: ${
			msg.createdTimestamp - message.createdTimestamp
		}ms.)`;

		return msg.edit(content);
	}
}
