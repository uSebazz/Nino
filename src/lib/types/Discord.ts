import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import type { Guild, GuildMember, Message } from 'discord.js';

export interface GuildMessage extends Message {
	channel: GuildTextBasedChannelTypes;
	readonly guild: Guild;
	readonly member: GuildMember;
}
