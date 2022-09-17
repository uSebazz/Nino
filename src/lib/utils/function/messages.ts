import { getHaste } from '#utils/api';
import { floatPromise, resolveOnErrorCodes } from '#utils/commons';
import { minutes } from '#utils/function';
import { canSendAttachments } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { codeBlock } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';
import type { Message, MessageOptions } from 'discord.js';
import { setTimeout as sleep } from 'timers/promises';

export async function handleMessage<ED extends ExtraDataPartial>(
	message: Message,
	options: HandleMessageData<ED>
): Promise<Message | Message[] | null> {
	const footer = options.footer ? `**type**: ${options.footer}` : '';
	const time = options.time ? `**time**: ${options.time}` : '';

	switch (options.sendAs) {
		case 'file':
			return sendAsFile(message, options, footer, time);
		case 'haste':
		case 'hastebin':
			return sendAsHastebin(message, options);
		case 'console':
		case 'log':
			return sendAsLog(message, options);
		case 'abort':
		case 'none':
			return null;
		default: {
			if (options.content ? options.content.length > 1950 : options.result!.length > 1950) {
				await getTypeOutput(message, options);
				return handleMessage(message, options);
			}

			if (options.content) {
				const content = codeBlock('md', options.content);
				return send(message, content);
			}

			if (options.success) {
			}

			const output = codeBlock(options.language ?? 'ts', options.result!);
			const content = `**Error**: ${output}\n**Type**: ${options.footer}\n**Time**: ${options.time}`;
			return send(message, { content });
		}
	}
}

async function sendAsFile<ED extends ExtraDataPartial>(message: Message, options: HandleMessageData<ED>, footer: string, time: string) {
	if (canSendAttachments(message.channel)) {
		const output = 'Send as file';
		const content = [output, footer, time].filter(Boolean).join('\n');

		const language = options.language ?? 'txt';
		const attachment = Buffer.from(options.content ? options.content : options.result!, 'utf8');
		const name = options.targetId ? `${options.targetId}.${language}` : `output.${language}`;

		return send(message, { content, files: [{ name, attachment }] });
	}
	await getTypeOutput(message, options);
	return handleMessage(message, options);
}

async function sendAsHastebin<ED extends ExtraDataPartial>(message: Message, options: HandleMessageData<ED>) {
	if (!options.url) {
		options.url = await getHaste(options.content ? options.content : options.result!, options.language ?? 'md').catch(() => null);
	}
	if (options.url) {
		const output = `Send as hastebin: ${options.url}`;
		const content = [output, options.footer, options.time].filter(Boolean).join('\n');
		return send(message, { content });
	}
	options.hastebinUnavailable = true;
	await getTypeOutput(message, options);
	return handleMessage(message, options);
}

async function sendAsLog<ED extends ExtraDataPartial>(message: Message, options: HandleMessageData<ED>) {
	if (options.canLogToConsole) {
		container.logger.info(options.result);
		const output = 'Send as console';
		const content = [output, options.footer, options.time].filter(Boolean).join('\n');
		return send(message, { content });
	}
	await getTypeOutput(message, options);
	return handleMessage(message, options);
}

async function getTypeOutput<ED extends ExtraDataPartial>(message: Message, options: HandleMessageData<ED>) {
	const _options = ['none', 'abort'];
	if (options.canLogToConsole) _options.push('log');

	if (canSendAttachments(message.channel)) _options.push('file');
	if (!options.hastebinUnavailable) _options.push('hastebin');

	let choice: string;
	do {
		const content = await promptForMessage(message, `Choose one of the following options: ${_options}`);
		choice = content?.toLowerCase() ?? 'none';
	} while (!_options.concat('none', 'abort').includes(choice));

	options.sendAs = choice;
}

async function deleteMessageImmediately(message: Message): Promise<Message> {
	return (await resolveOnErrorCodes(message.delete(), RESTJSONErrorCodes.UnknownMessage)) ?? message;
}

export async function deleteMessage(message: Message, time = 0): Promise<Message> {
	if (message.deleted) return message;
	if (time === 0) return deleteMessageImmediately(message);

	const lastEditedTimestamp = message.editedTimestamp;
	await sleep(time);

	if (message.deleted || message.editedTimestamp !== lastEditedTimestamp) {
		return message;
	}

	return deleteMessageImmediately(message);
}

async function promptForMessage(message: Message, sendOptions: string | MessageOptions, time = minutes(1)): Promise<string | null> {
	const response = await message.channel.send(sendOptions);
	const responses = await message.channel.awaitMessages({ filter: (msg) => msg.author === message.author, time, max: 1 });
	floatPromise(deleteMessage(response));

	return responses.size === 0 ? null : responses.first()!.content;
}

type HandleMessageData<ED extends ExtraDataPartial> = {
	sendAs: string | null;
	hastebinUnavailable: boolean;
	url: string | null;
	canLogToConsole: boolean;
} & ED;

export interface EvalExtraData extends QueryExtraData {
	footer: string;
}

export interface ContentExtraData {
	content: string;
	targetId: string;
}

export interface QueryExtraData {
	success: boolean;
	result: string;
	time: string;
	language: string;
}

type ExtraDataPartial = Partial<EvalExtraData> & Partial<ContentExtraData> & Partial<QueryExtraData>;
