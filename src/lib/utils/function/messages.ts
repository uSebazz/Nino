import { Emojis } from '#utils/constants'
import { send } from '@sapphire/plugin-editable-commands'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { Message, CommandInteraction } from 'discord.js'


/**
 * Send a message error with emoji to current channel.
 * @use sendError(key, { message or interaction })
 */

export async function sendError(key: string, { message, interaction }: { message?: Message, interaction?: CommandInteraction }) {
	const error = await resolveKey(message ?? interaction!, key, {
		emoji: Emojis.wrong
	})

	if (message) {
		await send(message, error)
	} else {
		await interaction!.reply(error)
	}
}
