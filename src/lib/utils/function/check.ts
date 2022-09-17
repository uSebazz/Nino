import type { GuildMessage } from '#lib/types';
import type { Message } from 'discord.js';

export function isGuildMessage(message: Message): message is GuildMessage {
	return message.guild !== null;
}