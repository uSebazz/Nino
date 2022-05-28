import {
	InteractionHandler,
	InteractionHandlerTypes,
	type InteractionHandlerOptions,
} from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { codeBlock } from '@discordjs/builders'
import type { ModalSubmitInteraction } from 'discord.js'

@ApplyOptions<InteractionHandlerOptions>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class ModalSubmitHandler extends InteractionHandler {
	public override async run(interaction: ModalSubmitInteraction) {
		const message =
			interaction.fields.getTextInputValue('favoriteColorInput')

		await interaction.reply({
			content: `Ok your favorite color is ${codeBlock(message)}`,
		})
	}
}
