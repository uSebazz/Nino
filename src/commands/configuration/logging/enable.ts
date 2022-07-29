import { LanguageKeys } from '#lib/i18n'
import { LoggingEvents } from '#utils/constants'
import { Command, RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced'
import type { EventsConfig } from '@prisma/client'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { CommandInteraction, Message } from 'discord.js'

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder //
		.setName('enable')
		.setDescription('Enable a event for the logging system')
		.addStringOption((option) =>
			option //
				.setName('event')
				.setDescription('The event to enable')
				.addChoices(...LoggingEvents)
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		const event = interaction.options.getString('event')!
		return this.storageData(event, interaction)
	}

	public override async messageRun(message: Message) {
		return send(message, await resolveKey(message, LanguageKeys.Config.Logging.OnlySlashCommand))
	}

	private async storageData(event: string, interaction: CommandInteraction) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: interaction.guildId!
			}
		})

		if (!data?.channelId) {
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelNotSet))
		}

		switch (event) {
			case 'all':
				return this.allCase(data, interaction)

			default:
				return this.defaultCase(event, data, interaction)
		}
	}

	private async allCase(data: EventsConfig, interaction: CommandInteraction) {
		if (!data.all) {
			// Save the data
			await this.container.prisma.eventsConfig.update({
				where: {
					guildId: interaction.guildId!
				},
				data: {
					all: true,
					events: []
				}
			})

			// Send the message
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.AllEventsEnabled))
		}

		const content = await resolveKey(interaction, LanguageKeys.Config.Logging.AlreadyAllEventsEnabled)
		return interaction.reply({
			content,
			ephemeral: true
		})
	}

	private async defaultCase(event: string, data: EventsConfig, interaction: CommandInteraction) {
		if (!data.all && !data.events.includes(event)) {
			await this.container.prisma.eventsConfig.update({
				where: {
					guildId: interaction.guildId!
				},
				data: {
					events: [...data.events, event]
				}
			})

			return interaction.reply(
				await resolveKey(interaction, LanguageKeys.Config.Logging.EventEnabled, {
					event
				})
			)
		}

		if (data.all) {
			const content = await resolveKey(interaction, LanguageKeys.Config.Logging.EventBlocked)
			return interaction.reply({
				content,
				ephemeral: true
			})
		}

		const content = await resolveKey(interaction, LanguageKeys.Config.Logging.EventAlreadyEnabled)
		return interaction.reply({
			content,
			ephemeral: true
		})
	}
}
