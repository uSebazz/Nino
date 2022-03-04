import { Command, ApplicationCommandRegistry } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { NinoUtils } from '../../lib/utils.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export class PlayMusicCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			preconditions: ['inVoiceChannel'],
			requiredClientPermissions: ['CONNECT', 'SPEAK'],
		});
	}
	/**
	 *
	 * @param { CommandInteraction } interaction
	 */
	async chatInputRun(interaction) {
		/**
		 * @type {import('../../class/client').Nino}
		 */

		const client = this.container.client;
		const emote = new NinoUtils().emojis;
		const color = new NinoUtils().colors;
		const { options, guild } = interaction;
		const { channel } = interaction.member.voice;

		switch (options.getSubcommand()) {
			case 'play': {
			}
		}
	}
	/**
	 *
	 * @param { ApplicationCommandRegistry } registery
	 */
	registerApplicationCommands(registery) {
		registery.registerChatInputCommand(
			{
				name: 'music',
				description: 'SubCommands for a music',
				options: [
					{
						name: 'play',
						description: 'play a music',
						type: 'SUB_COMMAND',
						options: [
							{
								name: 'track',
								description: 'track to play',
								type: 'STRING',
								required: true,
							},
						],
					},
				],
			},
			{
				guildIds: ['945033113673801799', '846937568753745921'],
				idHints: ['948394148334018652'],
			}
		);
	}
}
