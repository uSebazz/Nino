import { Precondition, type PreconditionResult } from '@sapphire/framework'
import type { CommandInteraction, GuildMember } from 'discord.js'

export class channelSpeak extends Precondition {
	public override chatInputRun(interaction: CommandInteraction): PreconditionResult {
		const guildMe = interaction.guild!.me as GuildMember
		const guildMember = interaction.member as GuildMember
		const vChannel = guildMember.voice.channel

		if (!vChannel?.permissionsFor(guildMe).has('SPEAK')) {
			return this.error({
				message: 'You must be able to speak in this channel to use this command.',
			})
		}
		return this.ok()
	}
}
