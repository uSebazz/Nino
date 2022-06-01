import { isGuildMessage } from '#utils/function/check'
import { Argument, type ArgumentContext } from '@sapphire/framework'
import {
	SnowflakeRegex,
	UserOrMemberMentionRegex,
} from '@sapphire/discord.js-utilities'
import type { GuildMessage } from '#lib/types/Discord'
import type { User } from 'discord.js'

export class UserArguments extends Argument<User> {
	private get user(): Argument<User> {
		return this.store.get('user') as Argument<User>
	}

	public override async run(
		parameter: string,
		context: ArgumentContext<User>
	) {
		const message = context.message as GuildMessage
		const userErrorContent = 'arguments:userError'
		if (!isGuildMessage(message)) return this.user.run(parameter, context)

		const user = await this.resolveUser(message, parameter)
		if (user) return this.ok(user)
		if (user === null) {
			return this.error({
				parameter,
				identifier: userErrorContent,
			})
		}

		const result = await this.fetchMember(message, parameter)
		if (result) return this.ok(result.user)
		return this.error({
			parameter,
			identifier: userErrorContent,
		})
	}

	private async resolveUser(message: GuildMessage, argument: string) {
		const result =
			UserOrMemberMentionRegex.exec(argument) ??
			SnowflakeRegex.exec(argument)
		if (result === null) return undefined

		try {
			return await message.client.users.fetch(result[1] as string)
		} catch {
			return null
		}
	}

	private async fetchMember(message: GuildMessage, query: string) {
		try {
			const results = await message.guild.members.fetch({ query })
			return results.first() ?? null
		} catch {
			return null
		}
	}
}
