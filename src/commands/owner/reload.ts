import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { ApplicationCommandRegistry } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<Command.Options>({
	name: 'reload',
	description: 'reload commands',
	preconditions: ['OwnerOnly'],
})
export class ReloadCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		interaction.reply('hola');
	}

	public override async registerApplicationCommands(registery: ApplicationCommandRegistry) {
		registery.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
			},
			{
				guildIds: ['951101886684082176'],
			}
		);
	}
}
