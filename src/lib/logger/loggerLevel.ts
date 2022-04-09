/* eslint-disable newline-per-chained-call */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { LoggerStyle, LoggerStyleResolvable } from './loggerStyle'
import { LoggerTimestamp, LoggerTimestampOptions } from './loggerTimestamp'

export class LoggerLevel {
	public timestamp: LoggerTimestamp | null
	public infix: string
	public message: LoggerStyle | null

	public constructor(options: LoggerLevelOptions = {}) {
		this.timestamp =
			options.timestamp === null ? null : new LoggerTimestamp(options.timestamp)
		this.infix = options.infix ?? ''
		this.message = options.message === null ? null : new LoggerStyle(options.message)
	}

	public run(content: string) {
		const prefix = (this.timestamp?.run() ?? '') + this.infix

		if (prefix.length) {
			const formatter = this.message //
				? (line: string) => prefix + this.message!.run(line)
				: (line: string) => prefix + line
			return content.split('\n').map(formatter).join('\n')
		}

		return this.message ? this.message.run(content) : content
	}
}

export interface LoggerLevelOptions {
	timestamp?: LoggerTimestampOptions | null

	infix?: string

	message?: LoggerStyleResolvable | null
}
