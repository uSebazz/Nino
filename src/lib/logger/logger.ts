/* eslint-disable computed-property-spacing */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Logger as BuiltinLogger, LogLevel, LogMethods } from '@sapphire/framework'
import {
	gray,
	green,
	magenta,
	isColorSupported,
	red,
	white,
	yellow,
	Color,
	cyan,
	bgRed,
} from 'colorette'
import { Console } from 'console'
import { inspect, InspectOptions } from 'util'
import { LoggerLevel, LoggerLevelOptions } from './loggerLevel'

/**
 *  The logger class is used to log messages to the console.
 *  It is used by the framework to log messages.
 *  You can use it to log messages to the console.
 *  @since 1.0.0
 */

export class Logger extends BuiltinLogger {
	public readonly console: Console
	public readonly formats: Map<LogLevel, LoggerLevel>
	public readonly join: string
	public readonly depth: number

	public constructor(options: LoggerOptions = {}) {
		super(options.level ?? LogLevel.Info)
		this.console = new Console(
			options.stdout ?? process.stdout,
			options.stderr ?? process.stderr
		)
		this.formats = Logger.createFormatMap(options.format, options.defaultFormat)
		this.join = options.join ?? ' '
		this.depth = options.depth ?? 0
	}

	public override write(level: LogLevel, ...values: readonly unknown[]): void {
		if (level < this.level) return

		const method = this.levels.get(level) ?? 'log'
		const formatter = this.formats.get(level) ?? this.formats.get(LogLevel.None)!

		this.console[method](formatter.run(this.preprocess(values)))
	}

	protected preprocess(values: readonly unknown[]) {
		const inspectOptions: InspectOptions = { colors: isColorSupported, depth: this.depth }
		return values
			.map((value) => (typeof value === 'string' ? value : inspect(value, inspectOptions)))
			.join(this.join)
	}

	private get levels() {
		return Reflect.get(BuiltinLogger, 'levels') as Map<LogLevel, LogMethods>
	}

	public static get stylize() {
		return isColorSupported
	}
	private static createFormatMap(
		options: LoggerFormatOptions = {},
		defaults: LoggerLevelOptions = options.none ?? {}
	) {
		return new Map<LogLevel, LoggerLevel>([
			[
				LogLevel.Trace,
				Logger.ensureDefaultLevel(options.trace, defaults, green, '✔ success:'),
			],
			[
				LogLevel.Debug,
				Logger.ensureDefaultLevel(options.trace, defaults, magenta, '◉ debug:'),
			],
			[LogLevel.Info, Logger.ensureDefaultLevel(options.info, defaults, cyan, 'ℹ info:')],
			[
				LogLevel.Warn,
				Logger.ensureDefaultLevel(options.warn, defaults, yellow, '⚠ warn:'),
			],
			[
				LogLevel.Error,
				Logger.ensureDefaultLevel(options.error, defaults, red, '✖ error:'),
			],
			[
				LogLevel.Fatal,
				Logger.ensureDefaultLevel(options.fatal, defaults, bgRed, '✖ fatal:'),
			],
			[LogLevel.None, Logger.ensureDefaultLevel(options.none, defaults, white, '')],
		])
	}

	private static ensureDefaultLevel(
		options: LoggerLevelOptions | undefined,
		defaults: LoggerLevelOptions,
		color: Color,
		name: string
	) {
		if (options) return new LoggerLevel(options)
		return new LoggerLevel({
			...defaults,
			timestamp:
				defaults.timestamp === null
					? null
					: { ...(defaults.timestamp ?? {}), color: gray },
			infix: name.length ? `${color(name.padEnd(5, ' '))} ` : '',
		})
	}
}

export interface LoggerOptions {
	stdout?: NodeJS.WriteStream
	stderr?: NodeJS.WriteStream
	defaultFormat?: LoggerLevelOptions
	format?: LoggerFormatOptions
	level?: LogLevel
	join?: string
	depth?: number
}

export interface LoggerFormatOptions {
	trace?: LoggerLevelOptions
	debug?: LoggerLevelOptions
	info?: LoggerLevelOptions
	warn?: LoggerLevelOptions
	error?: LoggerLevelOptions
	fatal?: LoggerLevelOptions
	none?: LoggerLevelOptions
}
