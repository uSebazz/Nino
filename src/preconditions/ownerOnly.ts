import { Precondition, type PreconditionResult } from '@sapphire/framework'
import type { CommandInteraction, Message } from 'discord.js'

export class ownerOnly extends Precondition {
	public override chatInputRun(interaction: CommandInteraction): PreconditionResult {
		return ['899339781132124220', '852630893767426079', '853468425203613736'].includes(
			interaction.user.id
		)
			? this.ok()
			: this.error({
					message: '> Oops... this command is restricted to my developer...',
			  })
	}
	public override messageRun(message: Message): PreconditionResult {
		return ['899339781132124220', '852630893767426079', '853468425203613736'].includes(
			message.author.id
		)
			? this.ok()
			: this.error({
					message: '> Oops... this command is restricted to my developer...',
			  })
	}
}
