import { Listener, container } from '@sapphire/framework';

export class MessageCreateListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			event: 'messageCreate',
		});
	}
	/**
	 * @param { Message } message
	 */
	async run(message) {
		const { client } = container;
		const Regex = new RegExp(`^<@!?${client.user.id}>( |)$`);
		if (message.content.match(Regex)) {
			return message.reply('Hola, ¿Que necesitas?');
		}
	}
}
