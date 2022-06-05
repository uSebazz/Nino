import { Emojis } from '#utils/constants'
import { Listener, type Events } from '@sapphire/framework'
import { envParseString } from '@skyra/env-utilities'
import { WebhookClient, type Guild } from 'discord.js'

export class guildDeleteListener extends Listener<typeof Events.GuildCreate> {
	public override async run(guild: Guild) {
		await this.send(guild)
	}

	private async send(guild: Guild) {
		const webhook = new WebhookClient({ url: envParseString('WEBHOOK_TOKEN') })
		const timeStamp = `<t:${Date.now() / 1000 | 0}:R>`
		const owner = await guild.fetchOwner()

		await webhook.send({
			content: `${Emojis.ninozzz} **Nino** has removed to **${guild.name}**!\n> **Members**: ${guild.memberCount}\n> **Owner**: ${owner.user.tag}\n> **Date**: ${timeStamp}`,
		})
	}
}
