import { Precondition } from '@sapphire/framework';

export class OwnerOnlyPrecondition extends Precondition {
	run(message) {
		return message.author.id === '899339781132124220'
			? this.ok()
			: this.error({
					message: 'Only the bot owner can use this command!'
			  });
	}
}
