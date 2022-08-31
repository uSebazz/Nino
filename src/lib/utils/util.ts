import {
	ChatInputCommandSuccessPayload,
	Command,
	container,
	ContextMenuCommandSuccessPayload,
	MessageCommandSuccessPayload
} from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import { cyan } from 'colorette';
import type { APIUser } from 'discord-api-types/v10';
import type { Guild, Message, User } from 'discord.js';
import { setTimeout as wait } from 'node:timers/promises';

export const ZeroWidthSpace = '\u200B';

export function getContent(message: Message) {
	if (message.content) return message.content;

	for (const embed of message.embeds) {
		if (embed.description) return embed.description;
		if (embed.title) return embed.title;
		if (embed.footer) return embed.footer.text;
	}

	return null;
}

/**
 * @use sendLocalizedTemporaryMessage(message, LanguageKeys...) => Promise<Message>
 * @param message message param
 * @param content content param
 * @returns a message localized by the locale of the message
 */
export async function sendLocalizedTemporaryMessage(message: Message, content: string) {
	const key = await resolveKey(message, content);

	const msg = await send(message, { content: key });

	return wait(5000, async () => {
		await msg.delete();
	});
}

export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

	if ('interaction' in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}

/**
 * @author Skyra Project Team
 */
export function cleanMentions(guild: Guild, input: string) {
	return input.replace(/@(here|everyone)/g, `@${ZeroWidthSpace}$1`).replace(/<(@[!&]?|#)(\d{17,19})>/g, (match, type, id) => {
		switch (type) {
			case '@':
			case '@!': {
				const tag = guild.client.users.cache.get(id);
				return tag ? `@${tag.username}` : `<${type}${ZeroWidthSpace}${id}>`;
			}
			case '@&': {
				const role = guild.roles.cache.get(id);
				return role ? `@${role.name}` : match;
			}
			case '#': {
				const channel = guild.channels.cache.get(id);
				return channel ? `#${channel.name}` : `<${type}${ZeroWidthSpace}${id}>`;
			}
			default:
				return `<${type}${ZeroWidthSpace}${id}>`;
		}
	});
}
