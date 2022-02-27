import { Listener } from '@sapphire/framework';

export class CommandDeniedListener extends Listener {
	async run(error, { interaction }) {
		return interaction.reply({
			ephemeral: true,
			content: error.message,
		});
	}
}
