import { Listener, type Events } from '@sapphire/framework'
import { NonThreadGuildBasedChannel } from 'discord.js'

export class UserListener extends Listener<typeof Events.ChannelCreate> {
	public override run(channel: NonThreadGuildBasedChannel) {
		console.log(channel)
	}
}
