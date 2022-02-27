import { Command } from '@sapphire/framework';
import { Message, MessageButton, MessageActionRow, Formatters } from 'discord.js';
import { promisify, inspect } from 'util';
import { exec } from 'child_process';

export class EvalCode extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'eval',
			description: 'Evaluate code',
			aliases: ['e', 'evaluate'],
			preconditions: ['OwnerOnly'],
		});
	}
	/**
	 * @param { Message } message
	 * @returns
	 */
	async messageRun(message, args) {
		let evalued = undefined;
		if (args.finished) {
			message.channel.send('You not provide a code lol');
		}
		let x = await args.rest('string').catch((e) => String);
		try {
			evalued = await eval(x);
			evalued = inspect(evalued, { depth: 0 });
		} catch (e) {
			evalued = e.toString();
		}

		const mensaje = Formatters.codeBlock('js', evalued.slice(0, 1950));
		await message.reply({ content: mensaje });
	}
}
