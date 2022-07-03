import { LanguageKeys } from '#lib/i18n'
import { Colors } from '#utils/constants'
import { Listener, type Events } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import { codeBlock } from '@sapphire/utilities'
import { Message, MessageEmbed } from 'discord.js'

export class UserListener extends Listener<typeof Events.MessageUpdate> {
	public override async run(oldMessage: Message, newMessage: Message) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: newMessage.guildId!
			}
		})

		const channel = newMessage.guild!.channels.cache.get(data!.channelId!)
		if (oldMessage.author.bot || oldMessage.content === newMessage.content || !channel || channel.type !== 'GUILD_TEXT') return

		if (data?.all || data?.events.includes('messageUpdate')) {
			const embeds = await this.getEmbed(oldMessage, newMessage)
			await channel.send({ embeds })
		}
	}

	private async getEmbed(oldMessage: Message, newMessage: Message) {
		const embed = new MessageEmbed()
			.setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL() })
			.setDescription(
				await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdate, {
					channel: oldMessage.channel
				})
			)
			.addField(
				await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateInformation),
				await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateInformationContent, {
					before: oldMessage.content,
					after: newMessage.content
				})
			)
			.addField(
				await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateId),
				codeBlock(
					'ml',
					await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateIdContent, {
						newMessage
					})
				)
			)
			.setColor(Colors.pastelGreen)

		return [embed]
	}
}
