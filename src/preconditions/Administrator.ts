import { Emojis } from '#utils/constants'
import { Precondition } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { CommandInteraction, GuildMember } from 'discord.js'

export class Administrator extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const member = interaction.member as GuildMember
		const message2 = await resolveKey(interaction, 'precondition:admin', {
			emoji: Emojis.wrong
		})

		if (!member.permissions.has('ADMINISTRATOR')) {
			return this.error({ message: message2 })
		}

		return this.ok()
	}
}
