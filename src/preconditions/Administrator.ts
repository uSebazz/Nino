import { Emojis } from '#utils/constans'
import { Precondition } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { Message, CommandInteraction, GuildMember } from 'discord.js'

export class Administrator extends Precondition {
	public override async messageRun(message: Message) {
		const message2 = await resolveKey(message, 'permissions:admin', {
			emoji: Emojis.fail
		})
		if (!message.member!.permissions.has('ADMINISTRATOR')) {
			return this.error({ message: message2 })
		}

		return this.ok()
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		const member = interaction.member as GuildMember
		const message2 = await resolveKey(interaction, 'permissions:admin', {
			emoji: Emojis.fail
		})

		if (!member.permissions.has('ADMINISTRATOR')) {
			return this.error({ message: message2 })
		}

		return this.ok()
	}
}
