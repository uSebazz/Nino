/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { translate } from '#lib/i18n'
import { Listener, type Events, type MessageCommandDeniedPayload, type UserError } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import ms from 'ms'

export class UserListener extends Listener<typeof Events.MessageCommandDenied> {
	public override async run(error: UserError, { message }: MessageCommandDeniedPayload) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		if (Reflect.get(Object(error.context), 'silent')) return
		console.log(error)

		const identifier = translate(error.identifier)
		await message.reply(
			await resolveKey(message, identifier, {
				// @ts-expect-error sis
				remaining: ms(error.context.remaining as any)
			})
		)
	}
}
