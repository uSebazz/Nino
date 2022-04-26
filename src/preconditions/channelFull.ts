import { Precondition, type PreconditionResult } from '@sapphire/framework'
import type { CommandInteraction, GuildMember, Message } from 'discord.js'

export class channelFull extends Precondition {
	public override chatInputRun(interaction: CommandInteraction): PreconditionResult {
		const guildMember = interaction.member as GuildMember
		const vChannel = guildMember.voice.channel

		if (!vChannel?.full) {
			return this.error({
				message: 'Channel is full, i cant join you.',
			})
		}
		return this.ok()
	}

	public override messageRun(message: Message): PreconditionResult {
		const guildMember = message.member as GuildMember
		const vChannel = guildMember.voice.channel

		if (!vChannel?.full) {
			return this.error({
				message: 'Channel is full, i cant join you.',
			})
		}
		return this.ok()
	}
}
