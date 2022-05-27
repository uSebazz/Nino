import { ArgumentError, Listener, UserError } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import { translate } from '../../lib/i18n/translate'
import type { Events, MessageCommandErrorPayload } from '@sapphire/framework'
import type { Message } from 'discord.js'
import { Emojis } from '#utils/constans'

export class messageCommandError extends Listener<typeof Events.MessageCommandError> {
	public override run(error: Error, { message }: MessageCommandErrorPayload) {
		if (typeof error === 'string') return this.stringError(message, error)
		if (error instanceof ArgumentError) return this.argumentError(message, error)
		if (error instanceof UserError) return this.userError(message, error)

		return null
	}

	private async stringError(message: Message, error: string) {
		return send(
			message,
			await resolveKey(message, 'arguments:string', {
				error
			})
		)
	}

	private argumentError(message: Message, error: ArgumentError) {
		const identifier = translate(error.identifier)
		const argument = error.argument.name

		return send(message, `${identifier} - ${argument}`)
	}

	private async userError(message: Message, error: UserError) {
		const identifier = translate(error.identifier)

		return send(
			message,
			await resolveKey(message, identifier, {
				emoji: Emojis.fail
			})
		)
	}
}
