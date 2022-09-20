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
		.setName('disable')
		.setDescription('🔰 Disable a single event from logging system.')
		.addStringOption((option) =>
			option //
				.setName('event')
				.setDescription('🔰 Target event to disable')
				.setRequired(true)
				.setChoices(...LoggingEvents)
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
		return this.disable(event, interaction, channel);
	}

	public override async messageRun(message: Message<true>) {
		return send(message, await resolveKey(message, LanguageKeys.Config.Logging.OnlySlashCommand));
	}

	private async disable(event: Event, interaction: NinoCommand.Interaction<'cached'>, channel: GuildBasedChannelTypes) {
		const data = await this.container.prisma.logChannel.findFirst({
			where: {
				guildId: BigInt(interaction.guildId),
				channelId: BigInt(channel.id)
			}
		});

		if (!data) {
			this.error(LanguageKeys.Config.Logging.ChannelNotSet);
		}

		switch (event) {
			case Event.all:
				return this.caseAll(data, interaction);
			default:
				return this.caseDefault(data, event, interaction);
		}
	}

	private async caseAll(data: LogChannel, interaction: NinoCommand.Interaction<'cached'>) {
		if (!data.events.length) {
			this.error(LanguageKeys.Config.Logging.AlreadyAllEventsDisabled, {
				silent: true
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
				events: {
					set: []
				}
			}
		});

		// Send the message
		return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.AllEventsDisabled));
	}

	private async caseDefault(data: LogChannel, event: Event, interaction: NinoCommand.Interaction<'cached'>) {
		if (!data.events.includes(Event.all) && data.events.includes(event)) {
			const eventIndex = data.events.findIndex((index) => index === event);

			await this.container.prisma.logChannel.update({
				where: {
					guildId_channelId: {
						channelId: data.channelId,
						guildId: data.guildId
					}
				},
				data: {
					events: data.events.splice(eventIndex, 1)
				}
			});

			// great success :)
			return interaction.reply(
				await resolveKey(interaction, LanguageKeys.Config.Logging.EventDisabled, {
					event
				})
			);
		}

		this.error(LanguageKeys.Config.Logging.EventAlreadyDisabled, {
			silent: true
		});
	}
}
