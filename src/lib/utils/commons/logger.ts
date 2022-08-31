import { cleanMentions } from '#utils/util';
import { Timestamp } from '@sapphire/time-utilities';
import type { Guild, Message, MessageAttachment, MessageEmbed, User } from 'discord.js';

export function formatMessage(message: Message) {
	const header = formatHeader(message);
	const content = formatContents(message);
	return `${header}\n${content}`;
}

function formatHeader(message: Message) {
	return `${formatTimeStamp(message.createdTimestamp)} ${formatAuthor(message.author)}`;
}

function formatTimeStamp(timestamp: number) {
	const timeStamp = new Timestamp('MMM dd HH:mm:ss');
	return timeStamp.display(timestamp);
}

function formatAuthor(user: User) {
	return `${user.tag}${user.bot ? '[BOT]' : ''}`;
}

function formatContents(message: Message) {
	const output: string[] = [];
	const attachment = message.attachments;

	if (message.content.length > 0) output.push(formatContent(message.guild!, message.content));
	if (message.embeds.length > 0) output.push(message.embeds.map((embed) => formatEmbed(embed)).join('\n'));
	if (message.attachments.size > 0) output.push(attachment.map((attachment) => formatAttachment(attachment)).join('\n'));
	return output.join('\n');
}

function formatContent(guild: Guild, content: string): string {
	return cleanMentions(guild, content) // pq mierda
		.split('\n')
		.map((line) => `» ${line}`)
		.join('\n');
}

function formatAttachment(attachment: MessageAttachment) {
	return `» 📂 - ${attachment.name}: ${attachment.url}`;
}

function formatEmbed(embed: MessageEmbed) {
	const output: string[] = [];

	if (embed.description) output.push(`» 📖 - ${embed.description}`);
	if (embed.image) output.push(`» 🖼️ - ${embed.image.url}`);

	return output.join('\n');
}
