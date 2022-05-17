import { NinoCommand, type NinoCommandOptions } from '#lib/structures/NinoCommand'
import { testServer } from '#root/config'
import { ApplyOptions } from '@sapphire/decorators'
import { MessageActionRow, Modal, TextInputComponent } from 'discord.js'
import type { CommandInteraction } from 'discord.js'

@ApplyOptions<NinoCommandOptions>({
	description: 'peo',
	chatInputCommand: {
		register: true,
		guildIds: testServer,
		idHints: ['974699588227317830'],
	},
})
export class UserCommand extends NinoCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		// eslint-disable-next-line newline-per-chained-call
		const modal = new Modal().setCustomId('myModal').setTitle('My Modal')

		const favoriteColorInput = new TextInputComponent()
			.setCustomId('favoriteColorInput')
			.setLabel('Whats your favorite color?')
			.setStyle('SHORT')

		const firstActionRow = new MessageActionRow<TextInputComponent>().addComponents(
			favoriteColorInput
		)

		modal.addComponents(firstActionRow)

		await interaction.showModal(modal)
	}
}
