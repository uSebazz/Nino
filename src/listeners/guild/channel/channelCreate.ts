import { localizeChannelTypes } from '#utils/commons';
import { Listener, type Events } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { NonThreadGuildBasedChannel } from 'discord.js';

export class UserListener extends Listener<typeof Events.ChannelCreate> {
	public override run(channel: NonThreadGuildBasedChannel) {
		console.log(this.getChannelType(channel));
	}

	private getChannelType(channel: NonThreadGuildBasedChannel) {
		const channelLocalized = localizeChannelTypes(channel.type);

		return resolveKey(channel.guild, channelLocalized);
	}
}
