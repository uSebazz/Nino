import type { DMMessage, GuildMessage } from '#lib/types';
import type { Message } from 'discord.js';

export function isGuildMessage(message: Message): message is GuildMessage {
	return message.guild !== null;
}

export function isDmMessage(message: Message): message is DMMessage {
	return message.guild === null;
}
