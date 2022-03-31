import { Precondition, type PreconditionResult } from '@sapphire/framework'
import type { CommandInteraction, GuildMember } from 'discord.js'

export class channelFull extends Precondition {
	public override chatInputRun(interaction: CommandInteraction): PreconditionResult {
		const guildMember = interaction.member as GuildMember
		const vChannel = guildMember.voice.channel

		if (!vChannel?.full) {
			return this.error({
				message: 'That channel is full, i can\'t join',
			})
		}
		return this.ok()
	}
}
