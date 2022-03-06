import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, GuildMember, VoiceBasedChannel } from 'discord.js';

export class inVoiceChannel extends Precondition {
	public override chatInputRun(interaction: CommandInteraction) {
		const member = interaction.member as GuildMember;
		const vChannel = member.voice.channel as VoiceBasedChannel;

		if (!vChannel) {
			return this.error({
				message: 'You must be in voice channel to use this command.',
			});
		}
		return this.ok();
	}
}
