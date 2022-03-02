import { Command, ApplicationCommandRegistry } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

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
		const { options, member, guild } = interaction;
		const { channel } = interaction.member.voices;

		switch (options.getSubcommand()) {
			case 'play': {
				const track = options.getString('track');

				const player = client.manager.create({
					guild: guild.id,
					voiceChannel: channel.id,
					textChannel: interaction.channel.id,
					selfDeafen: true,
					volume: 80,
				});

				if (player.state != 'CONNECTED') await player.connect();
				let rest;

				try {
					rest = player.search(track, interaction.user);
					if (!player) return;

					if (rest.loadType === 'LOAD_FAILED') {
						if (!player.queue.current) player.destroy();
						throw rest.exception;
					}
				} catch (err) {
					await interaction.reply('Error, srry.');
					console.log(err);
				}

				switch ((await rest).loadType) {
					case 'NO_MATCHES': {
						if (!player.queue.current) await player.destroy();
					}
				}
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
				guildIds: ['945033113673801799'],
				idHints: [],
			}
		);
	}
}
