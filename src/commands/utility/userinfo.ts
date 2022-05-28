import {
	NinoCommand,
	type NinoCommandOptions,
	type NinoCommandRegistery,
} from '#lib/structures'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message, CommandInteraction } from 'discord.js'
@ApplyOptions<NinoCommandOptions>({
	description: 'view user information',
	aliases: ['ui', 'user', 'info-user', 'whois'],
})
export class UserCommand extends NinoCommand {
	public override registerApplicationCommands(
		registery: NinoCommandRegistery
	) {
		registery.registerChatInputCommand((builder) =>
			builder
				//
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option
						//
						.setName('user')
						.setDescription('the user to view information about')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						//
						.setName('type')
						.setDescription('type of information to view')
						.setRequired(false)
						.setChoices({ name: 'canvas', value: 'canvas' })
				)
		)
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply('Not implemented yet')
	}

	public override messageRun(message: Message) {
		return message.channel.send('ok')
	}
}
