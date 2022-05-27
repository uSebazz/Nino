import { NinoCommand, type NinoCommandOptions } from '#lib/structures/NinoCommand'
import { testServer } from '#root/config'
import { Emojis } from '#utils/constans'
import { ApplyOptions } from '@sapphire/decorators'
import { fetchLanguage, resolveKey } from '@sapphire/plugin-i18next'
import { send } from '@sapphire/plugin-editable-commands'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'
import { setTimeout as wait } from 'node:timers/promises'
import type { Message, SelectMenuInteraction, CommandInteraction } from 'discord.js'

@ApplyOptions<NinoCommandOptions>({
	description: 'Configure the bot language',
	aliases: ['config-lang', 'configure-language', 'setting-language', 'lang'],
	preconditions: ['Administrator'],
	chatInputCommand: {
		register: true,
		guildIds: testServer,
		idHints: ['974699587501715566']
	}
})

export class UserCommand extends NinoCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const content = await resolveKey(interaction, 'commands/config:language.select', {
			emoji: Emojis.emergency
		})

		await interaction.reply({ content: 'Enviado!', ephemeral: true })

		const msg = await interaction.channel!.send({
			content,
			components: this.components
		})

		return this.collector(msg, {
			int: interaction
		})
	}

	public override async messageRun(message: Message) {
		const content = await resolveKey(message, 'commands/config:language.select', {
			emoji: Emojis.emergency
		})

		const msg = await send(message, {
			content,
			components: this.components
		})

		return this.collector(msg, {
			message
		})
	}

	private async collector(
		msg: Message<boolean>,
		{ message, int }: { message?: Message; int?: CommandInteraction }
	) {
		const languages = {
			spanish: 'es-ES',
			english: 'en-US',
			german: 'de-DE'
		}
		const timefinish = await resolveKey(msg, 'commands/config:language.timefinish', {
			emoji: Emojis.pending
		})

		const collector = msg.createMessageComponentCollector({
			filter: async (interaction) => {
				const content = await resolveKey(interaction, 'commands/config:language.filter', {
					emoji: Emojis.fail
				})

				if (interaction.user.id === message?.author.id || int?.user.id) {
					return true
				} else {
					await interaction.reply({ content, ephemeral: true })
					return false
				}
			},
			idle: 60000
		})

		collector.on('collect', async (interaction: SelectMenuInteraction) => {
			const guildLocale = await fetchLanguage(interaction)
			const values = interaction.values[0] as 'spanish' | 'english' | 'german'

			// Keys of the language
			const content = await resolveKey(interaction, 'commands/config:language.already', {
				emoji: Emojis.fail
			})
			const done = await resolveKey(interaction, 'commands/config:language.done', {
				emoji: Emojis.check,
				lang: languages[values]
			})

			// If the language is already set
			if (guildLocale === languages[values]) {
				await interaction.reply({ content, ephemeral: true })
			} else {
				// Update the language of the guild
				await this.container.prisma.config.update({
					where: {
						guildId: interaction.guildId as string
					},
					data: {
						lang: languages[values]
					}
				})

				// Send the message
				await interaction.reply({
					content: done,
					ephemeral: true
				})

				// Stop the collector
				await wait(5000).then(() => collector.stop())
			}
		})

		collector.on('end', async () => {
			await msg.edit({
				content: timefinish,
				components: []
			})
		})
	}

	private get components(): MessageActionRow[] {
		return [
			new MessageActionRow().addComponents([
				new MessageSelectMenu()
					.setCustomId('menu')
					.setPlaceholder('Select a language')
					.addOptions([
						{
							label: 'English - (USA).',
							emoji: '🇺🇲',
							value: 'english'
						},
						{
							label: 'Español - (México)',
							emoji: '🇲🇽',
							value: 'spanish'
						},
						{
							label: 'German - (Deutchland)',
							emoji: '🇩🇪',
							value: 'german'
						}
					])
			])
		]
	}
}
