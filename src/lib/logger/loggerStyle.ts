/* eslint-disable no-nested-ternary */
/* eslint-disable computed-property-spacing */
import * as Colorette from 'colorette'

export class LoggerStyle {
	public style: Colorette.Color

	public constructor(resolvable: LoggerStyleResolvable = {}) {
		if (typeof resolvable === 'function') {
			this.style = resolvable
		} else {
			const styles: Colorette.Color[] = []
			if (resolvable.effects) {
				styles.push(...resolvable.effects.map((text) => Colorette[text]))
			}
			if (resolvable.text) styles.push(Colorette[resolvable.text])
			if (resolvable.background) styles.push(Colorette[resolvable.background])

			this.style = (
				styles.length
					? styles.length === 1
						? styles[0]
						: (string) =>
								styles.reduce((out, style) => style(out), string) as string
					: Colorette.reset
			) as Colorette.Color
		}
	}

	public run(string: string | number) {
		return this.style(string)
	}
}

export interface LoggerStyleOptions {
	effects?: LoggerStyleEffect[]
	text?: LoggerStyleText
	background?: LoggerStyleBackground
}

export type LoggerStyleResolvable = Colorette.Color | LoggerStyleOptions

export const enum LoggerStyleEffect {
	Reset = 'reset',
	Bold = 'bold',
	Dim = 'dim',
	Italic = 'italic',
	Underline = 'underline',
	Inverse = 'inverse',
	Hidden = 'hidden',
	Strikethrough = 'strikethrough',
}

export const enum LoggerStyleText {
	Black = 'black',
	Red = 'red',
	Green = 'green',
	Yellow = 'yellow',
	Blue = 'blue',
	Magenta = 'magenta',
	Cyan = 'cyan',
	White = 'white',
	Gray = 'gray',
	BlackBright = 'blackBright',
	RedBright = 'redBright',
	GreenBright = 'greenBright',
	YellowBright = 'yellowBright',
	BlueBright = 'blueBright',
	MagentaBright = 'magentaBright',
	CyanBright = 'cyanBright',
	WhiteBright = 'whiteBright',
}
export const enum LoggerStyleBackground {
	Black = 'bgBlack',
	Red = 'bgRed',
	Green = 'bgGreen',
	Yellow = 'bgYellow',
	Blue = 'bgBlue',
	Magenta = 'bgMagenta',
	Cyan = 'bgCyan',
	White = 'bgWhite',
	BlackBright = 'bgBlackBright',
	RedBright = 'bgRedBright',
	GreenBright = 'bgGreenBright',
	YellowBright = 'bgYellowBright',
	BlueBright = 'bgBlueBright',
	MagentaBright = 'bgMagentaBright',
	CyanBright = 'bgCyanBright',
	WhiteBright = 'bgWhiteBright',
}
