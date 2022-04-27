import { NinoCommand } from '../../class/command'
import { seconds } from '../../lib/function/times'
import { clean } from '../../lib/function/clean'
import { ApplyOptions } from '@sapphire/decorators'
import { codeBlock, filterNullAndUndefinedAndEmpty, isThenable } from '@sapphire/utilities'
import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch'
import { bold, hideLinkEmbed } from '@discordjs/builders'
import { setTimeout as sleep } from 'node:timers/promises'
import { Stopwatch } from '@sapphire/stopwatch'
import { canSendMessages } from '@sapphire/discord.js-utilities'
import { inspect, promisify } from 'node:util'
import { exec } from 'child_process'
import { send } from '@sapphire/plugin-editable-commands'
import Type from '@sapphire/type'
import type { APIMessage } from 'discord-api-types/v9'
import type { CommandInteraction, Message } from 'discord.js'
import type { Args } from '@sapphire/framework'

@ApplyOptions<NinoCommand.Options>({
	description: 'Evalúa cualquier código JavaScript (Comando restringido para las personas)',
	aliases: ['e', 'evaluate', 'code'],
	flags: ['async', 'no-timeout', 'json', 'silent', 'log', 'showHidden', 'hidden'],
	options: ['wait', 'lang', 'language', 'output', 'output-to', 'depth'],
	preconditions: ['ownerOnly'],
})
export class EvalCommand extends NinoCommand {
	readonly #timeout = 60000

	readonly #language: Array<[name: string, value: string]> = [
		['JavaScript', 'js'],
		['TypeScript', 'ts'],
		['JSON', 'json'],
		['Raw text', 'txt'],
	]

	readonly #outputChoices: Array<[name: string, value: string]> = [
		['Reply', 'reply'],
		['File', 'file'],
		['Hastebin', 'hastebin'],
		['Console', 'console'],
		['Exec', 'exec'],
		['Abort', 'none'],
	]

	public override registerApplicationCommands(registry: NinoCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.setDefaultPermission(true)
					.addStringOption((option) =>
						option
							.setName('code')
							.setDescription('Código a evaluar')
							.setRequired(true)
					)
					.addIntegerOption((option) =>
						option
							.setName('depth')
							.setDescription('Profundidad de inspección a aplicar.')
					)
					.addStringOption((builder) =>
						builder
							.setName('language')
							.setDescription('Lenguaje del bloque de código de salida.')
							.setChoices(this.#language)
					)
					.addStringOption((builder) =>
						builder
							.setName('output-to')
							.setDescription('Ubicación a la que enviar la salida.')
							.setChoices(this.#outputChoices)
					)
					.addBooleanOption((builder) =>
						builder
							.setName('async')
							.setDescription(
								'Este código debe ser evaluado de forma asíncrona.'
							)
					)
					.addBooleanOption((builder) =>
						builder
							.setName('no-timeout')
							.setDescription(
								'No debería haber ningún tiempo de espera para evaluar este código.'
							)
					)
					.addBooleanOption((builder) =>
						builder
							.setName('silent')
							.setDescription(
								'El bot no debe dar una respuesta sobre la evaluación.'
							)
					)
					.addBooleanOption((builder) =>
						builder
							.setName('show-hidden')
							.setDescription(
								'Para mostrar las propiedades JSON ocultas al encadenarse.'
							)
					),
			{
				guildIds: ['951101886684082176'],
				idHints: ['954750745079586856'],
			}
		)
	}

	public override async messageRun(message: Message, args: Args) {
		const code = await args.rest('string')

		const wait = args.getOption('wait')
		// eslint-disable-next-line no-nested-ternary
		const flagTime = args.getFlags('no-timeout')
			? wait === null
				? this.#timeout
				: Number(wait)
			: Infinity
		const language =
			args.getOption('lang', 'language') ?? (args.getFlags('json') ? 'json' : 'js')

		const { success, result, time, type } = await this.evalTimed(
			message,
			args,
			code,
			flagTime
		)

		if (args.getFlags('silent')) {
			if (!success && result && (result as unknown as Error['stack'])) {
				this.container.logger.fatal(result as unknown as Error['stack'])
			}
		}

		const footer = codeBlock('ts', type)
		const sendAs =
			args.getOption('output', 'output-to') ?? (args.getFlags('log') ? 'log' : null)

		return this.handleMessage(message, {
			footer,
			time,
			language,
			hastebinUnavailable: false,
			url: null,
			canLogToConsole: true,
			success,
			result,
			sendAs: sendAs as 'file' | 'hastebin' | 'console' | 'none' | 'haste' | 'log',
			content: code,
			targetId: '',
		})
	}

	public override async chatInputRun(interaction: NinoCommand.Int) {
		const message = await interaction.deferReply({
			ephemeral: true,
			fetchReply: true,
		})

		const code = interaction.options.getString('code') as string
		const depth = interaction.options.getInteger('depth') ?? 0
		const language = interaction.options.getString('language') ?? 'ts'
		const outputTo = interaction.options.getString('output-to') ?? 'reply'
		const async = interaction.options.getBoolean('async') ?? false
		const noTimeout = interaction.options.getBoolean('no-timeout') ?? false
		const silent = interaction.options.getBoolean('silent') ?? false
		const showHidden = interaction.options.getBoolean('show-hidden') ?? false

		const timeout = noTimeout ? Infinity : this.#timeout

		const { success, result, time, type } = await this.timedEval(interaction, {
			message: message as Message,
			async,
			code,
			depth,
			showHidden,
			timeout,
		})

		if (silent) {
			if (!success && result && (result as unknown as Error['stack'])) {
				this.container.logger.fatal(result as unknown as Error['stack'])
			}
		}

		const footer = codeBlock('ts', type)

		return this.handleReply(interaction, {
			hastebinUnavailable: false,
			replyUnavailable: false,
			fileUnavailable: false,
			consoleUnavailable: true,
			execUnavailable: true,
			code,
			url: null,
			success,
			result,
			time,
			footer,
			language,
			outputTo: outputTo as 'reply' | 'file' | 'hastebin' | 'console' | 'exec' | 'none',
		})
	}

	private timedEval(
		interaction: CommandInteraction,
		{ timeout, ...evalParameters }: EvalParameters
	) {
		if (timeout === Infinity || timeout === 0) {
			return this.eval(interaction, { timeout, ...evalParameters })
		}

		return Promise.race([
			sleep(timeout).then(() => ({
				result: `Tardo más de ${seconds.fromMilliseconds(timeout)} segundos.`,
				success: false,
				time: '⏱ ...',
				type: 'EvalTimeoutError',
			})),
			this.eval(interaction, { timeout, ...evalParameters }),
		])
	}

	private evalTimed(message: Message, args: Args, code: string, flagTime: number) {
		if (flagTime === Infinity || flagTime === 0) return this.evaluate(message, args, code)

		return Promise.race([
			sleep(flagTime).then(() => ({
				result: `Tardo más de ${seconds.fromMilliseconds(flagTime)} segundos.`,
				success: false,
				time: '⏱ ...',
				type: 'EvalTimeoutError',
			})),
			this.evaluate(message, args, code),
		])
	}

	private async evaluate(message: Message, args: Args, code: string) {
		const stopwatch = new Stopwatch()
		let success: boolean
		let syncTime = ''
		let asyncTime = ''
		let result: unknown
		let thenable = false
		let type: Type | null = null

		try {
			if (args.getFlags('async')) code = `(async () => {\n${code}\n})();`

			// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const msg = message

			// eslint-disable-next-line no-eval
			result = eval(code)
			syncTime = stopwatch.toString()
			type = new Type(result)

			if (isThenable(result)) {
				thenable = true
				stopwatch.restart()
				// eslint-disable-next-line @typescript-eslint/await-thenable
				result = await result
				asyncTime = stopwatch.toString()
			}
			success = true
		} catch (error) {
			if (!syncTime.length) syncTime = stopwatch.toString()
			if (thenable && !asyncTime.length) asyncTime = stopwatch.toString()
			if (!type) type = new Type(error)
			result = error
			success = false
		}

		stopwatch.stop()
		if (typeof result !== 'string') {
			result =
				result instanceof Error
					? result.stack
					: inspect(result, {
							depth: Number(args.getOption('depth') ?? 0) || 0,
							showHidden: args.getFlags('showHidden', 'hidden'),
					  })
		}
		return {
			success,
			type: type,
			time: this.formatTime(syncTime, asyncTime),
			result: clean(result as string),
		}
	}

	private async handleMessage(
		message: Message,
		options: HandleMessageParams
	): Promise<Message | Message[] | undefined> {
		const typeFooter = ` ${bold('Type')}:${options.footer}`
		const timeTaken = options.time

		switch (options.sendAs) {
			case 'file': {
				if (canSendMessages(message.channel)) {
					const output = 'Sent the result as a file.'
					const content = [output, typeFooter, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')
					const fileExtension = options.language
					const attachment = Buffer.from(
						options.content ? options.content : options.result
					)
					const name = options.targetId
						? `${options.targetId}.${fileExtension}`
						: `output.${fileExtension}`
					await send(message, { content, files: [{ attachment, name }] })
				}
				return this.handleMessage(message, options)
			}

			case 'haste':
			case 'hastebin': {
				if (!options.url) {
					options.url = await this.getHaste(options.result, options.language).catch(
						() => null
					)
				}

				if (options.url) {
					const hastebinUrl = `Sent the result to hastebin: ${hideLinkEmbed(
						options.url
					)}`

					const content = [hastebinUrl, typeFooter, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')

					await send(message, content)
				}

				options.hastebinUnavailable = true

				// eslint-disable-next-line @typescript-eslint/await-thenable
				this.otherTypeOutput(options)
				return this.handleMessage(message, options)
			}

			case 'log':
			case 'console': {
				if (options.canLogToConsole) {
					this.container.logger.info(options.result)
					const output = 'Sent the result to console.'

					const content = [output, typeFooter, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')

					await send(message, content)
				}

				options.canLogToConsole = true
				// eslint-disable-next-line @typescript-eslint/await-thenable
				this.otherTypeOutput(options)
				return this.handleMessage(message, options)
			}
			case 'none':
				return send(message, 'Aborted!')

			default: {
				if (
					options.content
						? options.content.length > 1950
						: options.result.length > 1950
				) {
					// eslint-disable-next-line @typescript-eslint/await-thenable
					const haste = await this.getHaste(options.result, options.language).catch(
						() => null
					)

					return send(message, `Send the results to hastebin: ${haste as string}`)
				}

				if (options.success) {
					const parsedInput = `${bold('Input')}:${codeBlock(
						options.language,
						options.content
					)}`
					const parsedOutput = `${bold('Output')}:${codeBlock(
						options.language,
						options.result
					)}`

					const content = [parsedInput, parsedOutput, typeFooter, timeTaken]
						.filter(Boolean)
						.join('\n')
					return send(message, content)
				}

				const output = codeBlock(options.language, options.result)
				const content = `${bold('Error')}:${output}\n${bold('Type')}:${
					options.footer
				}\n${options.time}`
				return send(message, content)
			}
		}
	}

	private async eval(
		_interaction: CommandInteraction,
		{ message, code, async, depth, showHidden }: EvalParameters
	) {
		const stopwatch = new Stopwatch()
		let success: boolean
		let syncTime = ''
		let asyncTime = ''
		let result: unknown
		let thenable = false
		let type: Type | null = null

		try {
			if (async) code = `(async () => {\n${code}\n})()`

			// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const msg = message

			// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const interaction = _interaction

			// eslint-disable-next-line no-eval
			result = eval(code)
			syncTime = stopwatch.toString()
			type = new Type(result)
			if (isThenable(result)) {
				thenable = true
				stopwatch.restart()
				// eslint-disable-next-line @typescript-eslint/await-thenable
				result = await result
				asyncTime = stopwatch.toString()
			}
			success = true
		} catch (error) {
			if (!syncTime.length) syncTime = stopwatch.toString()
			if (thenable && !asyncTime.length) asyncTime = stopwatch.toString()
			if (!type) type = new Type(error)
			result = error
			success = false
		}

		stopwatch.stop()
		if (typeof result !== 'string') {
			result =
				result instanceof Error
					? result.stack
					: inspect(result, {
							depth,
							showHidden,
					  })
		}
		return {
			success,
			type: type,
			time: this.formatTime(syncTime, asyncTime),
			result: clean(result as string),
		}
	}

	private async handleReply(
		interaction: CommandInteraction,
		options: EvalReplyParameters
	): Promise<APIMessage | Message<boolean> | null> {
		const typeFooter = ` ${bold('Type')}:${options.footer}`
		const timeTaken = options.time

		switch (options.outputTo) {
			case 'file': {
				if (canSendMessages(interaction.channel)) {
					const output = 'Sent the result as a file.'
					const content = [output, typeFooter, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')

					const attachment = Buffer.from(options.result)
					const name = `output.${options.language}`

					return interaction.editReply({ content, files: [{ attachment, name }] })
				}

				options.fileUnavailable = true
				this.getOtherTypeOutput(options)

				return this.handleReply(interaction, options)
			}
			case 'hastebin': {
				if (!options.url) {
					options.url = await this.getHaste(options.result, options.language).catch(
						() => null
					)
				}

				if (options.url) {
					const hastebinUrl = `Sent the result to hastebin: ${hideLinkEmbed(
						options.url
					)}`

					const content = [hastebinUrl, typeFooter, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')

					return interaction.editReply({ content })
				}

				options.hastebinUnavailable = true

				this.getOtherTypeOutput(options)

				return this.handleReply(interaction, options)
			}
			case 'console': {
				this.container.logger.info(options.result)
				const output = 'Sent the result to console.'

				const content = [output, typeFooter, timeTaken] //
					.filter(filterNullAndUndefinedAndEmpty)
					.join('\n')

				return interaction.editReply({ content })
			}
			case 'exec': {
				try {
					const { stdout, stderr } = await promisify(exec)(options.code)

					if (!stdout && !stderr) {
						this.container.logger.warn('No output from exec.')
					}

					if (stdout.length > 1950) {
						options.url = await this.getHaste(stdout, options.language).catch(
							() => null
						)
					}

					if (options.url) {
						const hastebinUrl = `Sent the result to hastebin: ${hideLinkEmbed(
							options.url
						)}`

						const content = [hastebinUrl] //
							.filter(filterNullAndUndefinedAndEmpty)
							.join('\n')
						return interaction.editReply({ content })
					}

					const output = codeBlock(options.language, stdout)

					const content = `${bold('Input')}:${output}\n${options.time}`

					return interaction.editReply({ content })
				} catch (err) {
					const output = codeBlock(options.language, err)
					const content = `${bold('Error')}\n${output}\n${options.time}`

					return interaction.editReply({ content })
				}
			}
			case 'none': {
				return interaction.editReply({ content: 'Aborted!' })
			}
			case 'reply':
			default: {
				if (options.result.length > 1950) {
					options.replyUnavailable = true
					this.getOtherTypeOutput(options)

					return this.handleReply(interaction, options)
				}

				if (options.success) {
					const parsedInput = `${bold('Input')}:${codeBlock(
						options.language,
						options.code
					)}`
					const parsedOutput = `${bold('Output')}:${codeBlock(
						options.language,
						options.result
					)}`

					const content = [parsedInput, parsedOutput, typeFooter, timeTaken]
						.filter(Boolean)
						.join('\n')
					return interaction.editReply({ content })
				}

				const output = codeBlock(options.language, options.result)
				const content = `${bold('Error')}:${output}\n${bold('Type')}:${
					options.footer
				}\n${options.time}`
				return interaction.editReply({ content })
			}
		}
	}

	private getOtherTypeOutput(options: EvalReplyParameters) {
		if (!options.replyUnavailable) {
			options.outputTo = 'reply'
			return
		}

		if (!options.hastebinUnavailable) {
			options.outputTo = 'hastebin'
			return
		}

		if (!options.fileUnavailable) {
			options.outputTo = 'file'
			return
		}

		if (!options.consoleUnavailable) {
			options.outputTo = 'console'
			return
		}

		if (!options.execUnavailable) {
			options.outputTo = 'exec'
			return
		}

		options.outputTo = 'none'
	}

	private otherTypeOutput(options: HandleMessageParams) {
		if (!options.canLogToConsole) {
			options.sendAs = 'log'
		}

		if (!options.hastebinUnavailable) {
			options.sendAs = 'haste'
		}
	}

	private formatTime(syncTime: string, asyncTime?: string) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`
	}

	private async getHaste(result: string, language = 'js') {
		const { key } = await fetch<HastebinResponse>(
			'https://hastebin.skyra.pw/documents',
			{
				method: FetchMethods.Post,
				body: result,
			},
			FetchResultTypes.JSON
		)
		return `https://hastebin.skyra.pw/${key}.${language}`
	}
}

interface HastebinResponse {
	key: string
}

interface EvalReplyParameters {
	hastebinUnavailable: boolean
	replyUnavailable: boolean
	consoleUnavailable: boolean
	fileUnavailable: boolean
	execUnavailable: boolean
	url: string | null
	code: string
	success: boolean
	result: string
	time: string
	footer: string
	language: string
	outputTo: 'reply' | 'file' | 'hastebin' | 'console' | 'exec' | 'none'
}

interface EvalParameters {
	message: Message
	code: string
	async: boolean
	showHidden: boolean
	depth: number
	timeout: number
}

export interface HandleMessageParams {
	sendAs: 'file' | 'hastebin' | 'console' | 'none' | 'haste' | 'log'
	hastebinUnavailable: boolean
	url: string | null
	canLogToConsole: boolean
	footer: string
	content: string
	targetId: string
	success: boolean
	result: string
	time: string
	language: string
}

/**
 * @based in favna/dragonite eval and skyra/skyra eval<3
 */
