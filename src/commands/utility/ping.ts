import { NinoCommand } from '../../class/command'
import { ApplyOptions } from '@sapphire/decorators'
import { Message, type CommandInteraction } from 'discord.js'
import { resolveKey, type Target } from '@sapphire/plugin-i18next'

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
		const msg = await message.channel.send({
			content: 'Pinging...',
		})
		const diff = msg.createdTimestamp - message.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		await msg.edit(await resolveKey(message, 'util:ping', { diff, ping }))
	}

	public override async chatInputRun(interaction: NinoCommand.Int): Promise<void> {
		const msg = await interaction.reply({ content: 'Pinging...', fetchReply: true })
		const lang = interaction.channel as Target

		if (msg instanceof Message) {
			const { diff, ping } = this.getPing(msg, interaction)

			await msg.edit(await resolveKey(lang, 'util:ping', { diff, ping }))
		}
	}

	private getPing(message: Message, interaction: CommandInteraction) {
		const diff =
			(message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		return { diff, ping }
	}
}
