import { Precondition } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { Message } from 'discord.js'

export class Administrator extends Precondition {
	public override async messageRun(message: Message) {
		const message2 = await resolveKey(message, 'permissions:admin', {
			emoji: this.container.client.utils.emojis.fail,
		})
		if (!message.member!.permissions.has('ADMINISTRATOR')) {
			return this.error({ message: message2 })
		}

		return this.ok()
	}
}
