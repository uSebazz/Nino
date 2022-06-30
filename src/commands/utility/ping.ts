import { LanguageKeys } from '#lib/i18n'
import {
	NinoCommand,
	type NinoCommandOptions
} from '#lib/structures'
import { Emojis } from '#utils/constants'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import { Message, type CommandInteraction } from 'discord.js'

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
		const msg = await send(message, `${Emojis.ninoburrito} ping?`)
		const diff = msg.createdTimestamp - message.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		await send(
			message,
			await resolveKey(message, LanguageKeys.Util.Ping, { diff, ping })
		)
	}

	public override async chatInputRun(
		interaction: CommandInteraction
	): Promise<void> {
		const msg = await interaction.reply({
			content: `${Emojis.ninoburrito} ping?`,
			fetchReply: true,
		})

		if (msg instanceof Message) {
			const { diff, ping } = this.getPing(msg, interaction)

			await msg.edit(
				await resolveKey(interaction, LanguageKeys.Util.Ping, { diff, ping })
			)
		}
	}

	private getPing(message: Message, interaction: CommandInteraction) {
		const diff =
			(message.editedTimestamp || message.createdTimestamp) -
			interaction.createdTimestamp
		const ping = Math.round(this.container.client.ws.ping)

		return { diff, ping }
	}
}
