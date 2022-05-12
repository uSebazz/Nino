import { NinoCommand, type NinoCommandRegistery, type NinoCommandOptions } from '#class/command'
import { testServer } from '#root/config'
import { Model } from '#root/lib/database/guildConfig'
import { ApplyOptions } from '@sapphire/decorators'
import { fetchLanguage, resolveKey } from '@sapphire/plugin-i18next'
import { send } from '@sapphire/plugin-editable-commands'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'
import type { Message, SelectMenuInteraction } from 'discord.js'

@ApplyOptions<NinoCommandOptions>({
	description: 'Configure the bot language',
	aliases: ['config-lang', 'configure-language', 'setting-language', 'lang'],
	preconditions: ['Administrator']
})
export class configCommand extends NinoCommand {
	public override registerApplicationCommands(registry: NinoCommandRegistery): void {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		),
			{
				guildIds: testServer,
				idHints: ['959115551974756402'],
			}
	}

	public override async messageRun(message: Message) {
		const content = await resolveKey(message, 'commands/config:language.select', {
			emoji: this.container.client.utils.emojis.emergency,
		})
		const timefinish = await resolveKey(message, 'commands/config:language.timefinish', {
			emoji: this.container.client.utils.emojis.pending,
		})

		const msg = await send(message, {
			content,
			components: this.components,
		})

		const collector = msg.createMessageComponentCollector({
			filter: async (interaction) => {
				const content = await resolveKey(
					interaction,
					'commands/config:language.filter',
					{
						emoji: this.container.client.utils.emojis.fail,
					}
				)

				if (interaction.user.id === message.author.id) {
					return true
				} else {
					await interaction.reply({ content, ephemeral: true })
					return false
				}
			},
			idle: 60000,
		})

		collector.on('collect', async (interaction: SelectMenuInteraction) => {
			const { emojis } = this.container.client.utils
			const guildLocale = await fetchLanguage(interaction)
			const content = await resolveKey(interaction, 'commands/config:language.already', {
				emoji: emojis.fail,
			})
			const done = await resolveKey(interaction, 'commands/config:language.done', {
				emoji: emojis.check,
			})

			switch (interaction.values[0]) {
				case 'english': {
					if (guildLocale === 'en-US') {
						await interaction.reply({
							content,
							ephemeral: true,
						})
					} else {
						await Model.updateOne(
							{ guild: interaction.guildId },
							{
								$set: { 'config.language': 'en-US' },
							}
						)

						await msg.edit({ content: done, components: [] })
					}
					break
				}

				case 'spanish': {
					if (guildLocale === 'es-ES') {
						await interaction.reply({
							content,
							ephemeral: true,
						})
					} else {
						await Model.updateOne(
							{ guild: interaction.guildId },
							{
								$set: { 'config.language': 'es-ES' },
							}
						)

						await msg.edit({ content: done, components: [] })
					}
					break
				}
			}
		})

		collector.on('end', async () => {
			await msg.edit({
				content: timefinish,
				components: [],
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
							value: 'english',
						},
						{
							label: 'Español - (México)',
							emoji: '🇲🇽',
							value: 'spanish',
						},
					]),
			]),
		]
	}
}
