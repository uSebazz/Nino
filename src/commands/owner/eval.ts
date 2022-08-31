import { NinoCommand, type NinoCommandOptions } from '#lib/structures';
import { EvalExtraData, handleMessage, seconds } from '#utils/function';
import { clean } from '#utils/sanitizer';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import { Type } from '@sapphire/type';
import { cast, codeBlock, isThenable } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';
import { inspect } from 'node:util';

@ApplyOptions<NinoCommandOptions>({
	name: 'eval',
	description: 'Evaluates arbitrary JavaScript code.',
	preconditions: ['DevOnly'],
	flags: ['async', 'no-timeout', 'silent', 'log', 'hidden'],
	options: ['wait', 'lang', 'output', 'depth'],
	quotes: []
})
export class UserCommand extends NinoCommand {
	public kTimeout = 60000;

	public override async messageRun(message: Message, args: Args) {
		const code = await args.rest('string');

		const wait = args.getOption('wait');
		const flagTime = args.getFlags('no-timeout') ? (wait === null ? this.kTimeout : Number(wait)) : Infinity;
		const language = args.getOption('lang')!;
		const { success, result, time, type } = await this.timedEval(message, args, code, flagTime);

		if (args.getFlags('silent')) {
			if (!success && result && cast<Error>(result).stack) this.container.logger.fatal(cast<Error>(result).stack);
			return null;
		}

		const footer = codeBlock('ts', type);
		const sendAs = args.getOption('output') ?? (args.getFlags('log') ? 'log' : null);

		return handleMessage<Partial<EvalExtraData>>(message, {
			sendAs,
			hastebinUnavailable: false,
			url: null,
			canLogToConsole: true,
			success,
			result,
			time,
			footer,
			language
		});
	}

	private async timedEval(message: Message, args: Args, code: string, flagTime: number) {
		if (flagTime === Infinity || flagTime === 0) return this.eval(message, args, code);
		return Promise.race([
			sleep(flagTime).then(() => ({
				result: `Took longer than ${seconds.fromMilliseconds(flagTime)} seconds.`,
				success: false,
				time: '⏱ ...',
				type: 'EvalTimeoutError'
			})),
			this.eval(message, args, code)
		]);
	}

	private async eval(message: Message, args: Args, code: string) {
		const stopwatch = new Stopwatch();
		let syncTime = '';
		let asyncTime = '';
		let thenable = false;
		let success: boolean;
		let result: unknown;
		let type: Type;

		try {
			if (args.getFlags('async')) code = `(async () => {\n${code}\n})();`;

			// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
			const msg = message;

			// eslint-disable-next-line no-eval
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);

			if (isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}

			success = true;
		} catch (error) {
			if (!syncTime.length) syncTime = stopwatch.toString();
			if (thenable && !asyncTime.length) asyncTime = stopwatch.toString();
			if (!type!) type = new Type(error);
			result = error;
			success = false;
		}

		stopwatch.stop();

		if (typeof result !== 'string') {
			result =
				result instanceof Error
					? result.stack
					: args.getFlags('json')
					? JSON.stringify(result, null, 4)
					: inspect(result, {
							depth: Number(args.getOption('depth') ?? 0) || 0,
							showHidden: args.getFlags('showHidden', 'hidden')
					  });
		}
		return {
			success,
			type: type!,
			time: this.formatTime(syncTime, asyncTime ?? ''),
			result: clean(result as string)
		};
	}

	private formatTime(syncTime: string, asyncTime?: string) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}
}
