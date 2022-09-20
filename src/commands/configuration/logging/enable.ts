import { LanguageKeys } from '#lib/i18n';
import { NinoCommand } from '#lib/structures';
import { LoggingEvents } from '#utils/constants';
import { RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced';
import { Event, LogChannel } from '@prisma/client';
import type { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import { ChannelType } from 'discord-api-types/v10';
import type { Message } from 'discord.js';

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder
		.setName('enable')
		.setDescription('🔰 Enable a single event from logging system.')
		.addStringOption((option) =>
			option //
				.setName('event')
				.setDescription('🔰 Target event to enable')
				.addChoices(...LoggingEvents)
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option //
				.setName('channel')
				.setDescription('🔰 Target channel to log')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		)
)
export class UserCommand extends NinoCommand {
	public override chatInputRun(interaction: NinoCommand.Interaction<'cached'>) {
		const event = interaction.options.getString('event', true) as Event;
		const channel = interaction.options.getChannel('channel', true);
		return this.storageData(event, interaction, channel);
	}

	public override async messageRun(message: Message) {
		return send(message, await resolveKey(message, LanguageKeys.Config.Logging.OnlySlashCommand));
	}

	private async storageData(event: Event, interaction: NinoCommand.Interaction<'cached'>, channel: GuildBasedChannelTypes) {
		const data = await this.container.prisma.logChannel.findFirst({
			where: {
				guildId: BigInt(interaction.guildId),
				channelId: BigInt(channel.id)
			}
		});

		if (!data) {
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelNotSet));
		}

		switch (event) {
			case Event.all:
				return this.allCase(data, interaction);

			default:
				return this.defaultCase(event, data, interaction);
		}
	}

	private async allCase(data: LogChannel, interaction: NinoCommand.Interaction<'cached'>) {
		if (data.events.includes(Event.all) || data.events.length >= Object.keys(Event).length) {
			const content = await resolveKey(interaction, LanguageKeys.Config.Logging.AlreadyAllEventsEnabled);
			return interaction.reply({
				content,
				ephemeral: true
			});
		}

		// Save the data
		await this.container.prisma.logChannel.update({
			where: {
				guildId_channelId: {
					channelId: data.channelId,
					guildId: data.guildId
				}
			},
			data: {
				events: [Event.all]
			}
		});

		// Send the message
		return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.AllEventsEnabled));
	}

	private async defaultCase(event: Event, data: LogChannel, interaction: NinoCommand.Interaction) {
		if (!data.events.includes(Event.all) && !data.events.includes(event)) {
			await this.container.prisma.logChannel.update({
				where: {
					guildId_channelId: {
						channelId: data.channelId,
						guildId: data.guildId
					}
				},
				data: {
					events: {
						push: event
					}
				}
			});

			return interaction.reply(
				await resolveKey(interaction, LanguageKeys.Config.Logging.EventEnabled, {
					event
				})
			);
		}

		if (data.events.includes(Event.all)) {
			this.error(LanguageKeys.Config.Logging.EventBlocked, {
				silent: true
			});
		}

		this.error(LanguageKeys.Config.Logging.EventAlreadyEnabled, {
			silent: true
		});
	}
}
