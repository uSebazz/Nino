import { Precondition } from '@sapphire/framework';

export class OwnerOnlyPrecondition extends Precondition {
	chatInputRun(interaction) {
		return ['752336035228418059', '899339781132124220'].includes(interaction.user.id)
			? this.ok()
			: this.error({
					message: 'Only bot owner can use this command lol.',
			  });
	}
}
