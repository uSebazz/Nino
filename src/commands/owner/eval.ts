import { NinoCommand, type NinoCommandOptions } from '#lib/structures/NinoCommand'
import { clean } from '#utils/sanitizer/clean'
import { seconds } from '#utils/function/times'
import { send } from '@sapphire/plugin-editable-commands'
import { ApplyOptions } from '@sapphire/decorators'
import { Stopwatch } from '@sapphire/stopwatch'
import { canSendMessages } from '@sapphire/discord.js-utilities'
import { isThenable, codeBlock, filterNullAndUndefinedAndEmpty } from '@sapphire/utilities'
import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch'
import { Type } from '@sapphire/type'
import { bold } from '@discordjs/builders'
import { setTimeout as sleep } from 'node:timers/promises'
import { inspect, promisify } from 'node:util'
import { exec } from 'node:child_process'
import type { Args } from '@sapphire/framework'
import type { Message } from 'discord.js'

@ApplyOptions<NinoCommandOptions>({
	aliases: ['e', 'ev'],
	description: 'Evaluates JavaScript code',
	flags: ['async', 'no-timeout', 'json', 'silent', 'log', 'showHidden', 'hidden'],
	options: ['lang', 'output', 'depth'],
	preconditions: ['devOnly'],
	quotes: [],
})
export class UserCommand extends NinoCommand {
	public readonly timeout = 60000
	public override async messageRun(message: Message, args: Args) {
		const code = await args.rest('string')
		const flagTime = args.getFlags('no-timeout')
		const silent = args.getFlags('silent')
		const async = args.getFlags('async')
		const depth = (args.getOption('depth') ?? 0) || 0
		const showHidden = args.getFlags('showHidden', 'hidden')
		const language = args.getOption('lang') ?? (args.getFlags('json') ? 'json' : 'js')
		const outputTo = args.getOption('output') ?? 'reply'
		const timeout = flagTime ? Infinity : this.timeout

		const { success, result, time, type } = await this.timedEval(message, {
			async,
			code,
			depth: Number(depth),
			showHidden,
			timeout,
		})

		if (silent) {
			if (!success && result && (result as unknown as Error['stack'])) {
				this.container.logger.fatal(result as unknown as Error['stack'])
			}
		}

		const footer = codeBlock('ts', type)

		return this.handleMessage(message, {
			hastebinUnavailable: false,
			replyUnavailable: false,
			fileUnavailable: false,
			consoleUnavailable: true,
			execUnavailable: true,
			url: null,
			code,
			success,
			result,
			time,
			footer,
			language,
			outputTo: outputTo as 'reply' | 'file' | 'hastebin' | 'console' | 'exec' | 'none',
		})
	}
	private timedEval(message: Message, { timeout, ...evalParameters }: EvalParameters) {
		if (timeout === Infinity || timeout === 0) {
			return this.eval(message, { timeout, ...evalParameters })
		}

		return Promise.race([
			sleep(timeout).then(() => ({
				result: `Tardo más de ${seconds.fromMilliseconds(timeout)} segundos.`,
				success: false,
				time: '⏱ ...',
				type: 'EvalTimeoutError',
			})),
			this.eval(message, { timeout, ...evalParameters }),
		])
	}

	private async eval(message: Message, { code, async, depth, showHidden }: EvalParameters) {
		const stopwatch = new Stopwatch()
		let success: boolean
		let syncTime = ''
		let asyncTime = ''
		let result: unknown
		let thenable = false
		let type: Type | null = null

		try {
			if (async) code = `(async () => {\n${code}\n})();`

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

	private async handleMessage(
		message: Message,
		options: HandleMessageOptions
	): Promise<Message | Message[] | undefined> {
		const typeFooter = `${bold('Type')}:${options.footer}`
		const timeTaken = options.time

		switch (options.outputTo) {
			case 'file': {
				if (canSendMessages(message.channel)) {
					const output = 'Sent the result as a file.'
					const content = [output, typeFooter, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')

					const attachment = Buffer.from(options.result)
					const name = `output.${options.language}`

					return send(message, { files: [{ attachment, name }], content })
				}

				options.fileUnavailable = true
				this.getOtherTypeOutput(options)

				return this.handleMessage(message, options)
			}

			case 'hastebin': {
				if (!options.url) {
					options.url = await this.getHaste(options.result, options.language).catch(
						() => null
					)
				}

				if (options.url) {
					const hastebinUrl = `Sent the result to hastebin: ${options.url}`

					const content = [hastebinUrl, typeFooter, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')

					return send(message, { content })
				}
				options.hastebinUnavailable = true

				this.getOtherTypeOutput(options)

				return this.handleMessage(message, options)
			}

			case 'console': {
				this.container.logger.info(options.result)
				const output = 'Sent the result to console.'

				const content = [output, typeFooter, timeTaken] //
					.filter(filterNullAndUndefinedAndEmpty)
					.join('\n')

				return send(message, { content })
			}

			case 'exec': {
				const { stdout, stderr } = await promisify(exec)(options.code)

				if (!stdout && !stderr) {
					return send(message, { content: 'Invalid Command' })
				}
				if (stdout.length > 1950) {
					options.url = await this.getHaste(stdout, options.language).catch(
						() => null
					)
				}

				if (options.url) {
					const hastebinUrl = `Sent the result to hastebin: ${options.url}`

					const content = [hastebinUrl, timeTaken] //
						.filter(filterNullAndUndefinedAndEmpty)
						.join('\n')

					return send(message, { content })
				}

				const output = codeBlock(options.language, stdout)
				const content = [output, timeTaken] //
					.filter(filterNullAndUndefinedAndEmpty)
					.join('\n')

				return send(message, { content })
			}

			case 'none': {
				return send(message, { content: 'aborted' })
			}

			case 'reply':
			default: {
				if (options.result.length > 1950) {
					options.replyUnavailable = true
					this.getOtherTypeOutput(options)

					return this.handleMessage(message, options)
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
					return send(message, { content })
				}

				const output = codeBlock(options.language, options.result)
				const content = `${bold('Error')}:${output}\n${bold('Type')}:${
					options.footer
				}\n${options.time}`
				return send(message, { content })
			}
		}
	}

	private getOtherTypeOutput(options: HandleMessageOptions) {
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

interface HandleMessageOptions {
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
	code: string
	async: boolean
	showHidden: boolean
	depth: number
	timeout: number
}
