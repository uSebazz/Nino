import { translate } from '#lib/i18n'
import { Listener, type Events, type MessageCommandDeniedPayload, type UserError } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import { Message } from 'discord.js'

export class UserListener extends Listener<typeof Events.MessageCommandDenied> {
	public override async run(error: UserError, { message }: MessageCommandDeniedPayload) {
		if (Reflect.get(Object(error.context), 'silent')) return
		// console.log(error)

		if (error.identifier === 'DevOnly') return this.devOnly(message, error)

		const identifier = translate(error.identifier)
		const content = await resolveKey(message, identifier, {
			// @ts-expect-error - Ignore the type error
			remaining: error.context.remaining as any
		})

		return send(message, {
			content
		})
	}

	private async devOnly(message: Message, error: UserError) {
		return send(message, { content: error.message })
	}
}
