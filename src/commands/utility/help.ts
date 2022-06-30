import { LanguageKeys } from '#lib/i18n'
import { NinoCommand, type NinoCommandOptions } from '#lib/structures'
import { testServer } from '#root/config'
import { Colors } from '#utils/constants'
import { ApplyOptions } from '@sapphire/decorators'
import { reply } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { CommandInteraction, Message } from 'discord.js'
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'

@ApplyOptions<NinoCommandOptions>({
	description: 'Show bot menu, for all commands',
	aliases: ['ayuda', 'commands', 'command', 'cmd'],
	chatInputCommand: {
		register: true,
		guildIds: testServer,
	},
})
export class UserCommand extends NinoCommand {
	public override async messageRun(message: Message) {
		const embed = await this.embed({ message })

		await reply(message, {
			embeds: [embed],
			components: this.components,
		})
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		const embed = await this.embed({ message: interaction })

		await interaction.reply({
			embeds: [embed],
			components: this.components,
		})
	}


	private get components(): MessageActionRow[] {
		return [
			new MessageActionRow().addComponents([
				new MessageSelectMenu()
					.setCustomId('help-menu')
					.setPlaceholder('──── See my commands ────')
					.addOptions([
						{
							label: 'Utility',
							value: 'utility',
						},
						{
							label: 'Configuration',
							value: 'configuration',
						}
					])
			])
		]
	}

	private async embed({ message }: { message: CommandInteraction | Message }) {
		return new MessageEmbed()
			.setAuthor({
				name: 'Nino',
				iconURL: this.container.client.user!.displayAvatarURL()
			})
			.setDescription(
				await resolveKey(message, LanguageKeys.Util.Help.EmbedDescription, {
					user: '[Sebazz](https://github.com/uSebazz)',
					sapphire: '[Sapphire Framework](https://sapphirejs.dev)',
					prisma: '[Prisma](https://prisma.io)'
				})
			)
			.setColor(Colors.invisible)

	}
}
