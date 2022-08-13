import { cleanMentions } from '#utils/util';
import { container } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Timestamp } from '@sapphire/time-utilities';
import type { Guild, Message, MessageAttachment, MessageEmbed, User } from 'discord.js';

export async function getCommandList(t: Guild, category: string) {
	// const locale = await fetchLanguage(t)
	const command = container.stores.get('commands').filter((c) => c.category === category);
	const map = await Promise.all(
		command.map(async (cmd) => {
			const descriptionLocalized = await resolveKey(t, cmd.description);

			return `${cmd.name} - ${descriptionLocalized}`;
		})
	);

	return map.sort(sortCommandsAllphabetic);
}

export function sortCommandsAllphabetic(firstValue: string, secondValue: string): 1 | -1 | 0 {
	if (firstValue > secondValue) return 1;
	if (secondValue > firstValue) return -1;
	return 0;
}

export function localizeChannelTypes(channelType: string) {
	switch (channelType) {
		default:
			return `channels:${channelType}`;
	}
}

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
	if (message.content.length > 0) output.push(formatContent(message.guild!, message.content));
	if (message.embeds.length > 0) output.push(message.embeds.map((embed) => formatEmbed(embed)).join('\n'));
	if (message.attachments.size > 0) output.push(message.attachments.map((attachment) => formatAttachment(attachment)).join('\n'));
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
