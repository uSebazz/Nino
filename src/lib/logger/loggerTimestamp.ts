/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Timestamp } from '@sapphire/time-utilities'
import { LoggerStyle, LoggerStyleResolvable } from './loggerStyle'

export class LoggerTimestamp {
	public timestamp: Timestamp
	public utc: boolean
	public color: LoggerStyle | null
	public formatter: LoggerTimestampFormatter

	public constructor(options: LoggerTimestampOptions = {}) {
		this.timestamp = new Timestamp(options.pattern ?? 'YYYY-MM-DD HH:mm:ss')
		this.utc = options.utc ?? false
		this.color = options.color === null ? null : new LoggerStyle(options.color)
		this.formatter = options.formatter ?? ((timestamp) => `${timestamp} `)
	}

	public run() {
		const date = new Date()
		const result = this.utc ? this.timestamp.displayUTC(date) : this.timestamp.display(date)
		return this.formatter(this.color ? this.color.run(result) : result)
	}
}

export interface LoggerTimestampOptions {
	pattern?: string
	utc?: boolean
	color?: LoggerStyleResolvable | null
	formatter?: LoggerTimestampFormatter
}

export interface LoggerTimestampFormatter {
	(timestamp: string): string
}
