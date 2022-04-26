import { NinoCommand } from '../../class/command'
import { ApplyOptions } from '@sapphire/decorators'
import { Message, type CommandInteraction } from 'discord.js'
import { resolveKey } from '@sapphire/plugin-i18next'
import { send } from '@sapphire/plugin-editable-commands'

@ApplyOptions<NinoCommand.Options>({
	description: 'Ping of the bot',
	aliases: ['pong', 'latency'],
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

	public override async messageRun(message: Message): Promise<void> {
		const msg = await send(message, 'pinging...')
		const diff = msg.createdTimestamp - message.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		await send(message, await resolveKey(message, 'util:ping', { diff, ping }))
	}

	public override async chatInputRun(interaction: NinoCommand.Int): Promise<void> {
		const msg = await interaction.reply({ content: 'Pinging...', fetchReply: true })

		if (msg instanceof Message) {
			const { diff, ping } = this.getPing(msg, interaction)

			await msg.edit(await resolveKey(interaction, 'util:ping', { diff, ping }))
		}
	}

	private getPing(message: Message, interaction: CommandInteraction) {
		const diff =
			(message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		return { diff, ping }
	}
}
