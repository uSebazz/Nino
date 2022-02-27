import { Listener } from '@sapphire/framework';

export class CommandDeniedListener extends Listener {
	async run(error, { message }) {
		return message.reply(error.message);
	}
}
