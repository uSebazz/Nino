import { translate } from '#lib/i18n'
import { Emojis } from '#utils/constans'
import {
	Listener,
	type Events,
	type UserError,
	type ChatInputCommandDeniedPayload,
} from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'

export class chatInputCommandDeniedListener extends Listener<
	typeof Events.ChatInputCommandDenied
> {
	public override async run(
		error: UserError,
		{ interaction }: ChatInputCommandDeniedPayload
	) {
		const identifier = translate(error.identifier)

		await interaction.reply(
			await resolveKey(interaction, identifier, {
				emoji: Emojis.fail,
			})
		)
	}
}
