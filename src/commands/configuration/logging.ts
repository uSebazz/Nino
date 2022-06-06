import {
	NinoCommand,
	type NinoCommandRegistery,
	type NinoCommandOptions,
} from '#lib/structures/NinoCommand'
import { Emojis } from '#utils/constants'
import { testServer } from '#root/config'
import { LanguageKeys } from '#lib/i18n/Language/index'
import { ApplyOptions } from '@sapphire/decorators'
import { sendError } from '#utils/function/messages'
import { RegisterBehavior } from '@sapphire/framework'
import type { Message, CommandInteraction, Guild } from 'discord.js'
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10'

@ApplyOptions<NinoCommandOptions>({
	description: 'set events for logging system',
	aliases: ['log', 'logs'],
})
export class UserCommand extends NinoCommand {
	public choices: Array<APIApplicationCommandOptionChoice<string>> = [
		{
			name: 'All listeners',
			value: 'all',
		},
		{
			name: 'Message Delete',
			value: 'messageDelete',
		},
		{
			name: 'Message Bulk Delete',
			value: 'messageBulkDelete',
		},
		{
			name: 'Message Update',
			value: 'messageUpdate',
		},
		{
			name: 'Channel Create',
			value: 'channelCreate',
		},
		{
			name: 'Channel Delete',
			value: 'channelDelete',
		},
		{
			name: 'Channel Update',
			value: 'channelUpdate',
		},
	]

	public override registerApplicationCommands(
		registery: NinoCommandRegistery
	) {
		registery.registerChatInputCommand(
			(builder) =>
				builder
					//
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) =>
						subcommand
							//
							.setName('add')
							.setDescription(
								'add a event to the logging system'
							)
							.addStringOption((option) =>
								option
									.setName('event')
									.setDescription(
										'the event you want to add'
									)
									.addChoices(...this.choices)
									.setRequired(true)
							)
					),
			{
				guildIds: testServer,
				idHints: ['978075912295833661'],
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			}
		)
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: interaction.guild!.id,
			}
		})

		if (!data) {
			await this.container.prisma.eventsConfig.create({
				data: {
					guildId: interaction.guild!.id,
				}
			})
			return interaction.reply(`${Emojis.ninozzz} - Creating the logging system, use again the command`)
		}

		switch (interaction.options.getSubcommand(true)) {
			case 'add':
				return this.add(interaction)
			default:
				return sendError(LanguageKeys.Config.Logging.UnknownCommand, { interaction })
		}
	}

	private add(interaction: CommandInteraction) {
		const event = interaction.options.getString('event') as string

		return this.events({
			interaction,
			event,
			guild: interaction.guild!,
		})
	}

	// eslint-disable-next-line consistent-return
	private async events({ guild, interaction, event }: { guild: Guild, interaction: CommandInteraction, event: string }) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: guild.id,
			}
		})

		switch (event) {
			case 'all': {
				if (data?.all === false) {
					await this.container.prisma.eventsConfig.update({
						where: {
							guildId: guild.id,
						},
						data: {
							all: true,
							events: []
						}
					})
				} else {
					return sendError(LanguageKeys.Config.Logging.AllAlreadyEnabled, { interaction })
				}

				return interaction.reply(`${Emojis.ninozzz} - All events are now enabled`)
			}

			case 'messageDelete': {
				if (!data?.events.includes('messageDelete') && data?.all === false) {
					await this.container.prisma.eventsConfig.update({
						where: {
							guildId: guild.id
						},
						data: {
							events: [event]
						}
					})
				} else {
					return interaction.reply(`${Emojis.wrong} - This event already configured`)
				}

				return interaction.reply(`${Emojis.right} - \`${event}\` added to the logging system`)
			}
		}
	}

	public override messageRun(message: Message) {
		return message.reply(`${Emojis.excl} - This command only works in \`Slash Commands\``)
	}
}
