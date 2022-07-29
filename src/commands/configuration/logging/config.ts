import { LanguageKeys } from '#lib/i18n'
import { Command, RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { CommandInteraction, GuildBasedChannel, Message } from 'discord.js'

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder //
		.setName('config')
		.setDescription('Configure the logging system')
		.addChannelOption((option) =>
			option //
				.setName('channel')
				.setDescription('The channel to log to')
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		const channel = interaction.options.getChannel('channel') as GuildBasedChannel

		return this.storageData(interaction, channel)
	}

	public override async messageRun(message: Message) {
		return send(message, await resolveKey(message, LanguageKeys.Config.Logging.OnlySlashCommand))
	}

	private async storageData(interaction: CommandInteraction, channel: GuildBasedChannel) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: interaction.guildId!
			}
		})

		if (channel.type !== 'GUILD_TEXT') {
			const content = await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelInvalid)
			return interaction.reply({
				content,
				ephemeral: true
			})
		}

		if (!data) {
			await this.container.prisma.eventsConfig.create({
				data: {
					guildId: interaction.guildId!,
					channelId: channel.id
				}
			})

			return interaction.reply(
				await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelSet, {
					channel: `<#${channel.id}>`
				})
			)
		}

		await this.container.prisma.eventsConfig.update({
			where: {
				guildId: interaction.guildId!
			},
			data: {
				channelId: channel.id
			}
		})

		return interaction.reply(
			await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelUpdated, {
				channel: `<#${channel.id}>`
			})
		)
	}
}
