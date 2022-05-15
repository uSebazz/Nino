import { NinoCommand, type NinoCommandOptions } from '#lib/structures'
import { ApplyOptions } from '@sapphire/decorators'
import { Message, type CommandInteraction } from 'discord.js'
import { resolveKey } from '@sapphire/plugin-i18next'
import { send } from '@sapphire/plugin-editable-commands'

@ApplyOptions<NinoCommandOptions>({
	description: 'Ping of the bot',
	aliases: ['pong', 'latency'],
	chatInputCommand: {
		register: true,
		idHints: ['974700576971587584'],
	},
})
export class UserCommand extends NinoCommand {
	public override async messageRun(message: Message): Promise<void> {
		const { emojis } = this.container.client.utils
		const msg = await send(message, `${emojis.ninozzz} ping?`)
		const diff = msg.createdTimestamp - message.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		await send(message, await resolveKey(message, 'commands/util:ping', { diff, ping }))
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<void> {
		const { emojis } = this.container.client.utils
		const msg = await interaction.reply({
			content: `${emojis.ninozzz} ping?`,
			fetchReply: true,
		})

		if (msg instanceof Message) {
			const { diff, ping } = this.getPing(msg, interaction)

			await msg.edit(await resolveKey(interaction, 'commands/util:ping', { diff, ping }))
		}
	}

	private getPing(message: Message, interaction: CommandInteraction) {
		const diff =
			(message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		return { diff, ping }
	}
}
