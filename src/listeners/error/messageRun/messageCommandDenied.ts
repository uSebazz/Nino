import { translate } from '#lib/i18n'
import { Emojis } from '#utils/constans'
import {
	Listener,
	type Events,
	type UserError,
	type MessageCommandDeniedPayload,
} from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'

export class UserListener extends Listener<typeof Events.MessageCommandDenied> {
	public override async run(
		error: UserError,
		{ message }: MessageCommandDeniedPayload
	) {
		const identifier = translate(error.identifier)

		await send(
			message,
			await resolveKey(message, identifier, {
				emoji: Emojis.fail,
			})
		)
	}
}
