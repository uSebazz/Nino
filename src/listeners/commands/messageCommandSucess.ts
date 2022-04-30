import type { MessageCommandSuccessPayload, ListenerOptions } from '@sapphire/framework'
import { cyan } from 'colorette'
import { Events, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<ListenerOptions>({
	event: Events.MessageCommandSuccess,
})
export class MessageCommandSuccess extends Listener<typeof Events.MessageCommandSuccess> {
	public override run({ message, command }: MessageCommandSuccessPayload) {
		const shard = `[${cyan(message.guild?.shardId ?? 0)}]`
		const commandName = cyan(command.name)
		const author = `${message.author.username}[${cyan(message.author.id)}]`
		const guildName = message.guild
			? `${message.guild.name}[${cyan(message.guild.id)}]`
			: 'Direct Messages'
		this.container.logger.info(`${shard} - ${commandName} ${author} ${guildName}`)
	}
}
