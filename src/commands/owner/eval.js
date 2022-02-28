import { Command, ApplicationCommandRegistry } from '@sapphire/framework';
import { CommandInteraction, Formatters } from 'discord.js';
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
		/**
		 * @type {import('../../class/client').Nino}
		 */
		const { options } = interaction;

		const code = options.getString('code', true);
		let evalued = undefined;

		switch (options.getString('type', true)) {
			case '1': {
				try {
					evalued = await eval(code);
					evalued = inspect(evalued, { depth: 0 });
				} catch (err) {
					evalued = err.toString();
				}
				break;
			}
			case '2': {
				try {
					evalued = await eval('(async() => {\n' + code + '\n})();');
					evalued = inspect(evalued, { depth: 0 });
				} catch (err) {
					evalued = err.toString();
				}
				break;
			}
			case '3': {
				try {
					const { stdout, stderr } = await promisify(exec)(code);
					if (!stdout && !stderr) {
						console.log('Comando invalido (exec)');
					}
					if (stdout) evalued = stdout;
					if (stderr) evalued = stderr;
				} catch (err) {
					evalued = err.toString();
				}
				break;
			}
		}
		const mensaje = Formatters.codeBlock('js', evalued.slice(0, 1950));

		await interaction.reply({
			content: mensaje,
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
				{
					type: 'STRING',
					required: true,
					name: 'type',
					description: 'type of evaluate',
					choices: [
						{
							name: '-n',
							value: '1',
						},
						{
							name: '-a',
							value: '2',
						},
						{
							name: '-e',
							value: '3',
						},
					],
				},
			],
		});
	}
}
