import { Command, ApplicationCommandRegistry } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { NinoUtils } from '../../lib/utils';
import { MessageEmbed } from 'discord.js';
import type { GuildMember, CommandInteraction } from 'discord.js';

export class PlayMusicCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			preconditions: ['inVoiceChannel'],
			requiredClientPermissions: ['CONNECT', 'SPEAK'],
		});
	}
	async chatInputRun(interaction: CommandInteraction) {
		const client = this.container.client;
		const emote = new NinoUtils().emojis;
		const color = new NinoUtils().colors;
		const member = interaction.member as GuildMember;
		const { options, guild } = interaction;
		const { channel } = member.voice;

		switch (options.getSubcommand()) {
			case 'play': {
			}
		}
	}
	registerApplicationCommands(registery: ApplicationCommandRegistry) {
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
