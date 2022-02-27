import { Command, ApplicationCommandRegistry } from '@sapphire/framework';
import { CommandInteraction, MessageButton, MessageActionRow, Formatters } from 'discord.js';
import { promisify, inspect } from 'util';
import { exec } from 'child_process';

export class EvalCode extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			preconditions: ['OwnerOnly'],
		});
	}
	/**
	 *
	 * @param { CommandInteraction } interaction
	 */
	async chatInputRun(interaction) {
		const code = interaction.options.getString('code', true);
		let evalued = undefined;

		try {
			evalued = await eval(code);
			evalued = inspect(evalued, { depth: 0 });
		} catch (err) {
			evalued = err.message;
		}

		let evaluado = Formatters.codeBlock('js', evalued.slice(0, 1950));

		await interaction.reply({
			content: evaluado,
		});
	}
	/**
	 *
	 * @param { ApplicationCommandRegistry } registery
	 */
	registerApplicationCommands(registery) {
		registery.registerChatInputCommand({
			name: 'eval',
			description: 'evaluate a code',
			options: [
				{
					type: 'STRING',
					required: true,
					name: 'code',
					description: 'Code to evaluate',
				},
			],
		});
	}
}
