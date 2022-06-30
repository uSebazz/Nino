import { LanguageKeys } from '#lib/i18n'
import { getContent } from '#utils/util'
import { Listener, type Events } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import { cutText } from '@sapphire/utilities'
import type { Message, TextChannel } from 'discord.js'


export class UserListener extends Listener<typeof Events.MessageDelete> {
	public override async run(message: Message) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: message.guildId!,
			}
		})
		const channel = message.guild!.channels.cache.get(data!.channelId!)

		if (message.author.bot || !channel || channel.type !== 'GUILD_TEXT') return

		if (data?.all || data?.events.includes('messageDelete')) {
			if (message.attachments.size > 0) { await this.attachement(message, channel) } else {
				await channel.send(
					await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformation, {
						message,
						time: `<t:${message.createdTimestamp / 1000 | 0}:R>`,
						channel: message.channel,
						content: cutText(getContent(message) || '', 1900),
					})
				)
			}
		}
	}

	private async attachement(message: Message, channel: TextChannel) {
		const content = await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformation, {
			message,
			time: `<t:${message.createdTimestamp / 1000 | 0}:R>`,
			channel: message.channel,
			content: cutText(getContent(message) || 'Attachement', 1900),
		})
		const attachments = message.attachments.map((attachment) => attachment.proxyURL)

		return channel.send({ content, files: attachments })
	}
}
