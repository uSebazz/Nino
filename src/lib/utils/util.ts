import type { Message } from 'discord.js'

export function getContent(message: Message) {
	if (message.content) return message.content

	for (const embed of message.embeds) {
		if (embed.description) return embed.description
		if (embed.title) return embed.title
		if (embed.footer) return embed.footer.text
	}

	return null
}
