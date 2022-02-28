import { Precondition } from '@sapphire/framework';

export class OwnerOnlyPrecondition extends Precondition {
	chatInputRun(interaction) {
		return this.container.client.devs.includes(interaction.user.id)
			? this.ok()
			: this.error({
					message: 'Only my owner/developer can use this command.',
			  });
	}
}
