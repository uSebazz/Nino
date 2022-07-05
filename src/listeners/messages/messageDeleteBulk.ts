import { LanguageKeys } from '#lib/i18n'
import { formatMessage } from '#utils/commons'
import { Colors } from '#utils/constants'
import { Listener, type Events } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import { Collection, Message, MessageAttachment, MessageEmbed, Snowflake } from 'discord.js'

type MessagesType = Collection<Snowflake, Message>

export class UserListener extends Listener<typeof Events.MessageBulkDelete> {
	public override async run(messages: MessagesType) {
		const messageFirst = messages.first()!

		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: messageFirst.guildId!
			}
		})
		if (!data) return

		const channel = messageFirst.guild?.channels.cache.get(data!.channelId!)
		if (!channel || channel.type !== 'GUILD_TEXT') return

		if (data?.all || data?.events.includes('messageDeleteBulk')) {
			const embeds = await this.getEmbed(messages, messageFirst)

			await channel.send({ files: [this.getAttachment(messages)], embeds })
		}
	}

	private getAttachment(messages: MessagesType) {
		const procesed = messages
			.map((messages) => formatMessage(messages))
			.reverse()
			.join('\n')

		const buffer = Buffer.from(procesed)
		return new MessageAttachment(buffer, 'purge.txt')
	}

	private async getEmbed(collection: MessagesType, message: Message) {
		const embed = new MessageEmbed()
			.setDescription(
				await resolveKey(message, LanguageKeys.Messages.MessageDeleteBulk, {
					amount: collection.size,
					channel: message.channel
				})
			)
			.setColor(Colors.pastelGreen)

		return [embed]
	}
}
