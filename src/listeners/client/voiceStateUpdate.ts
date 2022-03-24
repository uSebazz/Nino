import { container, Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { VoiceState } from 'discord.js';
import delay from 'delay';

@ApplyOptions<Listener.Options>({
	name: 'voiceStateUpdate',
	emitter: container.client,
})
export class voiceStateUpdateListener extends Listener {
	async run(oldState: VoiceState, newState: VoiceState) {
		const player = container.client.music.players.get(oldState.guild.id);
		if (!player) return;
		if (newState.id === container.client.user.id && oldState.channelId && !newState.channelId) {
			container.client.music.destroyPlayer(player.guildId);
		}
		if (oldState.id === container.client.user.id) return;
		if (!oldState.guild.members.cache.get(container.client.user.id).voice.channelId) return;

		if (
			oldState.guild.members.cache.get(container.client.user.id).voice.channelId ===
			oldState.channelId
		) {
			if (
				oldState.guild.me.voice?.channel &&
				oldState.guild.me.voice.channel.members.filter((m) => !m.user.bot).size === 0
			) {
				const vcName = oldState.guild.me.voice.channel.id;
				await delay(120000);

				const vcMembers = oldState.guild.me.voice.channel?.members.size;
				if (!vcMembers || vcMembers === 1) {
					player.disconnect();
					container.client.music.destroyPlayer(player.guildId);
					return player.queue.channel.send({
						content: await resolveKey(
							oldState.guild,
							'music:events.voice_state_update',
							{
								vc: vcName,
							}
						),
					});
				}
			}
		}
	}
}
