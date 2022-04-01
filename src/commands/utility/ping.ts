import { NinoCommand } from '../../class/command'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<NinoCommand.Options>({
	description: 'Ping of the bot',
})
export class PingCommand extends NinoCommand {
	public override registerApplicationCommands(registry: NinoCommand.Registry): void {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		),
			{
				guildIds: ['951101886684082176'],
				idHints: ['959115551974756402'],
			}
	}

	public override async chatInputRun(interaction: NinoCommand.Int): Promise<void> {
		await interaction.reply('Pong!')
	}
}
