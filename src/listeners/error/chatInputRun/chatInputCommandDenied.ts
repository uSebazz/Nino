import { translate } from '#lib/i18n'
import { Emojis } from '#utils/constans'
import {
	Listener,
	type Events,
	type UserError,
	type ChatInputCommandDeniedPayload
} from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'

export class chatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
	public override run(error: UserError) {
		console.log(error)
	}
}
