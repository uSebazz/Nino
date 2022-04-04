import { Precondition, type PreconditionResult } from '@sapphire/framework'
import type { CommandInteraction, GuildMember, Message } from 'discord.js'

export class channelJoin extends Precondition {
	public override chatInputRun(interaction: CommandInteraction): PreconditionResult {
		const guildMe = interaction.guild!.me as GuildMember
		const guildMember = interaction.member as GuildMember
		const vChannel = guildMember.voice.channel

		if (!vChannel?.permissionsFor(guildMe).has('CONNECT')) {
			return this.error({
				message: 'You must be able to connect to this channel to use this command.',
			})
		}
		return this.ok()
	}

	public override messageRun(message: Message): PreconditionResult {
		const guildMe = message.guild!.me as GuildMember
		const guildMember = message.member as GuildMember
		const vChannel = guildMember.voice.channel

		if (!vChannel?.permissionsFor(guildMe).has('CONNECT')) {
			return this.error({
				message: 'You must be able to connect to this channel to use this command.',
			})
		}
		return this.ok()
	}
}