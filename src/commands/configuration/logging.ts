import {
	NinoCommand,
	type NinoCommandRegistery,
	type NinoCommandOptions,
} from '#lib/structures/NinoCommand'
import { testServer } from '#root/config'
import { ApplyOptions } from '@sapphire/decorators'
import { RegisterBehavior } from '@sapphire/framework'
import type { Message, CommandInteraction } from 'discord.js'
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
			name: 'Message Delete Bulk',
			value: 'messageDeleteBulk',
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

	public override chatInputRun(interaction: CommandInteraction) {
		switch (interaction.options.getSubcommand(true)) {
			case 'add':
				return this.add(interaction)
			default:
				return interaction.reply('peo')
		}
	}

	private add(interaction: CommandInteraction) {
		const event = interaction.options.getString('event')
		this.events({ event: event as 'messageDelete' | 'messageDeleteBulk' | 'messageUpdate' | 'channelCreate' | 'channelDelete' | 'channelUpdate' })
	}

	private events(config: LoggingEvents) {
		switch (config.event) {
			case 'messageDelete': {
				break
			}
		}
	}

	public override messageRun(message: Message) {
		return message.reply('Not implemented yet')
	}
}

interface LoggingEvents {
	event: 'messageDelete' | 'messageDeleteBulk' | 'messageUpdate' | 'channelCreate' | 'channelDelete' | 'channelUpdate'
}
