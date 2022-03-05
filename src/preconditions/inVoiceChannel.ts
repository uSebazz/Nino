import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, GuildMember } from 'discord.js';

export class inVoiceChannelPrecondition extends Precondition {
	public override chatInputRun(interaction: CommandInteraction) {
		const member = interaction.member as GuildMember;
		const vChannel = member.voice.channel;

		if (!vChannel) {
			return this.error({
				message: 'You must be in voice channel to use this command.',
			});
		}
		return this.ok();
	}
}

declare module '@sapphire/framework' {
	export interface Preconditions {
		inVoiceChannel: never;
	}
}
