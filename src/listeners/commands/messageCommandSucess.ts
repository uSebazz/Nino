import { cyan } from 'colorette'
import { Events, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { Guild, User } from 'discord.js'
import type {
	MessageCommandSuccessPayload,
	Command,
	ListenerOptions,
} from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: Events.MessageCommandSuccess,
})
export class MessageCommandSuccess extends Listener<
	typeof Events.MessageCommandSuccess
> {
	public run({ message, command }: MessageCommandSuccessPayload) {
		const shard = this.shard(message.guild?.shardId ?? 0)
		const commandName = this.command(command)
		const author = this.author(message.author)
		const sendAt = message.guild
			? this.guild(message.guild)
			: this.directMessage()
		this.container.logger.info(
			`${shard} - ${commandName} ${author} ${sendAt}`
		)
	}

	private shard(id: number) {
		return `[${cyan(id.toString())}]`
	}

	private command(command: Command) {
		return cyan(command.name)
	}

	private author(author: User) {
		return `${author.tag}[${cyan(author.id)}]`
	}

	private directMessage() {
		return 'Direct Messages'
	}

	private guild(guild: Guild) {
		return `${guild.name}[${cyan(guild.id)}]`
	}
}
