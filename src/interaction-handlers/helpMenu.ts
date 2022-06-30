import { getCommandList } from '#utils/function'
import { ApplyOptions } from '@sapphire/decorators'
import type { InteractionHandlerOptions } from '@sapphire/framework'
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework'
import type { SelectMenuInteraction } from 'discord.js'
import { MessageEmbed } from 'discord.js'

@ApplyOptions<InteractionHandlerOptions>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})

export class UserInteraction extends InteractionHandler {
	public override async run(interaction: SelectMenuInteraction) {
		const { values } = interaction
		const embed = new MessageEmbed()

		if (values[0] === 'utility') {
			const commands = getCommandList('utility')

			embed.setDescription(commands.join('\n'))

			await interaction.reply({ embeds: [embed], ephemeral: true })
		}
	}

	public override parse(interaction: SelectMenuInteraction) {
		if (interaction.customId === 'help-menu') {
			return this.some()
		}

		return this.none()
	}
}
