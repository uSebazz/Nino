import { LanguageKeys } from '#lib/i18n'
import { LoggingEvents } from '#utils/constants'
import { Command, RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced'
import type { EventsConfig } from '@prisma/client'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { CommandInteraction, Message } from 'discord.js'

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder //
		.setName('disable')
		.setDescription('Disable a event for the logging system')
		.addStringOption((option) =>
			option //
				.setName('event')
				.setDescription('The event to disable')
				.setRequired(true)
				.setChoices(...LoggingEvents)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		const event = interaction.options.getString('event')!
		return this.disable(event, interaction)
	}

	public override async messageRun(message: Message) {
		return send(message, await resolveKey(message, LanguageKeys.Config.Logging.OnlySlashCommand))
	}

	private async disable(event: string, interaction: CommandInteraction) {
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
				return this.caseAll(data, interaction)
			default:
				return this.caseDefault(data, event, interaction)
		}
	}

	private async caseAll(data: EventsConfig, interaction: CommandInteraction) {
		if (data.all) {
			// Save the data
			await this.container.prisma.eventsConfig.update({
				where: {
					guildId: interaction.guildId!
				},
				data: {
					all: false,
					events: []
				}
			})

			// Send the message
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.AllEventsDisabled))
		}

		const content = await resolveKey(interaction, LanguageKeys.Config.Logging.AlreadyAllEventsDisabled)
		return interaction.reply({
			content,
			ephemeral: true
		})
	}

	private async caseDefault(data: EventsConfig, event: string, interaction: CommandInteraction) {
		if (!data.all && data.events.includes(event)) {
			const newEvents = data.events
			const eventIndex = newEvents.findIndex((index) => index === event)
			newEvents.splice(eventIndex, 1)

			await this.container.prisma.eventsConfig.update({
				where: {
					guildId: interaction.guildId!
				},
				data: {
					events: newEvents
				}
			})

			// great success :)
			return interaction.reply(
				await resolveKey(interaction, LanguageKeys.Config.Logging.EventDisabled, {
					event
				})
			)
		}

		// Error
		const content = await resolveKey(interaction, LanguageKeys.Config.Logging.EventAlreadyDisabled)
		return interaction.reply({
			content,
			ephemeral: true
		})
	}
}
