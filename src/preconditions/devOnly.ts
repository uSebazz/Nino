import { OWNERS } from '#root/config'
import { Precondition } from '@sapphire/framework'
import type { CommandInteraction, ContextMenuInteraction, Message, Snowflake } from 'discord.js'

export class DevOnly extends Precondition {
	public readonly message = 'Oops! you arent allowed to use this command!'

	public override chatInputRun(interaction: CommandInteraction) {
		return this.isDev(interaction.user.id)
	}

	public override messageRun(message: Message) {
		return this.isDev(message.author.id)
	}

	public override contextMenuRun(context: ContextMenuInteraction) {
		return this.isDev(context.user.id) // i dont use context menu, but i put it here
	}

	private isDev(userId: Snowflake) {
		return OWNERS.includes(userId) ? this.ok() : this.error({ message: this.message })
	}
}
