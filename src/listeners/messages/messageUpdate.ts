import { Listener, type Events } from '@sapphire/framework'
import type { Message } from 'discord.js'

export class UserListener extends Listener<typeof Events.MessageUpdate> {
	public override run(oldMessage: Message, newMessage: Message) {
		console.log(oldMessage, newMessage)
	}
}
