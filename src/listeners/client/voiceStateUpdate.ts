import { Listener, type Events } from '@sapphire/framework'
import delay from 'delay'
import type { VoiceState } from 'discord.js'

export class VoiceStateUpdateListener extends Listener<typeof Events.VoiceStateUpdate> {
	public async run(oldState: VoiceState, newState: VoiceState): Promise<void> {
		const player = this.container.client.music.players.get(oldState.guild.id)
		if (!player) return

		if (
			newState.id === this.container.client.user?.id &&
			oldState.channelId &&
			!newState.channelId
		) {
			this.container.client.music.destroyPlayer(player.guildId)
		}

		if (oldState.id === this.container.client.user?.id) return
		if (
			!oldState.guild.members.cache.get(this.container.client.user?.id as string)?.voice
				.channelId
		) {
			return
		}

		if (
			oldState.guild.members.cache.get(this.container.client.user?.id as string)?.voice
				.channelId !== oldState.channelId
		) {
			if (
				oldState.guild.me?.voice.channel &&
				oldState.guild.me.voice.channel.members.filter((m) => !m.user.bot).size === 0
			) {
				const vcName = oldState.guild.me.voice.channel.id
				await delay(120000)

				const vcMembers = oldState.guild.me.voice.channel.members.size
				if (!vcMembers || vcMembers === 1) {
					player.disconnect()
					this.container.client.music.destroyPlayer(player.guildId)
					await player.queue.channel?.send({
						content: `:warning: **${oldState.guild.name}**'s voice channel **${vcName}** has been left due to inactivity.`,
					})
				}
			}
		}
	}
}
