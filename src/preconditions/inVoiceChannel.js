import { Precondition } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

export class inVoiceChannelPrecondition extends Precondition {
	/**
	 *
	 * @param { CommandInteraction } interaction
	 */
	chatInputRun(interaction) {
		const member = interaction.member;
		const vChannel = member.voice.channel;

		if (!vChannel) {
			return this.error({
				message: 'You must be in voice channel to use this command.',
			});
		}
		return this.ok();
	}
}
