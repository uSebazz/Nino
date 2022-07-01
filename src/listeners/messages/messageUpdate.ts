import { LanguageKeys } from '#lib/i18n'
import { getContent } from '#utils/util'
import { Listener, type Events } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import { cutText } from '@sapphire/utilities'
import type { Message } from 'discord.js'

export class UserListener extends Listener<typeof Events.MessageUpdate> {
	public override async run(oldMessage: Message, newMessage: Message) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: newMessage.guildId!
			}
		})

		const channel = newMessage.guild!.channels.cache.get(data!.channelId!)
		if (oldMessage.author.bot || !channel || channel.type !== 'GUILD_TEXT') return

		if (data?.all || data?.events.includes('messageUpdate')) {
			await channel.send(
				await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateInformation, {
					newMessage,
					oldMessage,
					newContent: cutText(getContent(newMessage) || '', 1900),
					oldContent: cutText(getContent(oldMessage) || '', 1900),
					channel: oldMessage.channel,
					time: `<t:${(newMessage.createdTimestamp / 1000) | 0}:R>`
				})
			)
		}
	}
}
