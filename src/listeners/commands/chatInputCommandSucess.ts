import type { ChatInputCommandSuccessPayload, ListenerOptions } from '@sapphire/framework'
import { Events, Listener } from '@sapphire/framework'
import { cyan, gray } from 'colorette'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<ListenerOptions>({
	event: Events.ChatInputCommandSuccess,
})
export class ChatInputCommandSuccess extends Listener<typeof Events.ChatInputCommandSuccess> {
	public run({ interaction, command }: ChatInputCommandSuccessPayload) {
		const shard = `[${cyan(interaction.guild?.shardId ?? 0)}]`
		const commandName = cyan(command.name)
		const author = `${interaction.user.username}[${cyan(interaction.user.id)}]`
		const guildName = interaction.guild
			? `${interaction.guild.name}[${cyan(interaction.guild.id)}]`
			: 'Direct Messages'
		this.container.logger.info(
			`[${gray('/')}] ${shard} - ${commandName} ${author} ${guildName}`
		)
	}
}
