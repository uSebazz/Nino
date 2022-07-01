import type { ChatInputCommandSuccessPayload, Command, ListenerOptions } from '@sapphire/framework'
import { Events, Listener } from '@sapphire/framework'
import { cyan, gray } from 'colorette'
import { ApplyOptions } from '@sapphire/decorators'
import type { Guild, User } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	event: Events.ChatInputCommandSuccess
})
export class ChatInputCommandSuccess extends Listener<typeof Events.ChatInputCommandSuccess> {
	public run({ interaction, command }: ChatInputCommandSuccessPayload) {
		const shard = this.shard(interaction.guild?.shardId ?? 0)
		const commandName = this.command(command)
		const author = this.author(interaction.user)
		const sendAt = interaction.guild ? this.guild(interaction.guild) : this.directMessage()
		this.container.logger.info(`[${gray('/')}] ${shard} - ${commandName} ${author} ${sendAt}`)
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
