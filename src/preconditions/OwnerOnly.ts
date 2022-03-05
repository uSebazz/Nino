import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

export class OwnerOnlyPrecondition extends Precondition {
	public override chatInputRun(interaction: CommandInteraction) {
		return ['899339781132124220'].includes(interaction.user.id)
			? this.ok()
			: this.error({
					message: 'Only my owner/developer can use this command.',
			  });
	}
}

declare module '@sapphire/framework' {
	export interface Preconditions {
		OwnerOnly: never;
	}
}
