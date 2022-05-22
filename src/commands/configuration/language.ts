import { NinoCommand, type NinoCommandOptions } from '#lib/structures/NinoCommand'
import { testServer } from '#root/config'
import { Model } from '#root/lib/database/guildConfig'
import { ApplyOptions } from '@sapphire/decorators'
import { fetchLanguage, resolveKey } from '@sapphire/plugin-i18next'
import { send } from '@sapphire/plugin-editable-commands'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'
import type { Message, SelectMenuInteraction, CommandInteraction } from 'discord.js'

@ApplyOptions<NinoCommandOptions>({
	description: 'Configure the bot language',
	aliases: ['config-lang', 'configure-language', 'setting-language', 'lang'],
	preconditions: ['Administrator'],
	chatInputCommand: {
		register: true,
		guildIds: testServer,
		idHints: ['974699587501715566'],
	},
})
export class UserCommand extends NinoCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const content = await resolveKey(interaction, 'commands/config:language.select', {
			emoji: this.container.client.utils.emojis.emergency,
		})

		await interaction.reply({ content: 'Enviado!', ephemeral: true })

		const msg = await interaction.channel!.send({
			content,
			components: this.components,
		})

		return this.collector(msg, {
			int: interaction,
		})
	}

	public override async messageRun(message: Message) {
		const content = await resolveKey(message, 'commands/config:language.select', {
			emoji: this.container.client.utils.emojis.emergency,
		})

		const msg = await send(message, {
			content,
			components: this.components,
		})

		return this.collector(msg, {
			message,
		})
	}

	private async collector(
		msg: Message<boolean>,
		{ message, int }: { message?: Message; int?: CommandInteraction }
	) {
		const timefinish = await resolveKey(msg, 'commands/config:language.timefinish', {
			emoji: this.container.client.utils.emojis.pending,
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

				if (interaction.user.id === message?.author.id || int?.user.id) {
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
						{
							label: 'German - (Deutchland)',
							emoji: '🇩🇪',
							value: 'german',
						}
					]),
			]),
		]
	}
}
