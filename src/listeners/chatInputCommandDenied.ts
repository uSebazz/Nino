import { Listener } from '@sapphire/framework';
import type { UserError, ChatInputCommandDeniedPayload } from '@sapphire/framework';


export class CommandDeniedListener extends Listener {
	async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		return interaction.reply({
			ephemeral: true,
			content: error.message,
		});
	}
}
