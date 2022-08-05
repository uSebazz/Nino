/**
 * @credits Skyra's project (https://github.com/Skyra-project/skyra)
 */
import * as Resolvers from '#lib/structures/colors'

const REGEXP = {
	HEX: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/i,
	HEX_EXEC: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/i,
	HSL: /^hsl\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/i,
	HSL_EXEC: /^hsl\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/i,
	RANDOM: /^(?:r|random)$/i,
	RGB: /^rgba?\(\d{1,3},\s?\d{1,3},\s?\d{1,3}(?:,.+)?\)$/i,
	RGB_EXEC: /^rgba?\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})(?:,.+)?\)$/i
}

export function parse(input: string): Resolvers.Colors | null {
	if (REGEXP.RANDOM.test(input)) return _generateRandomColor()
	const output = _HEX(input) || _RGB(input) || _HSL(input)

	return output
}

export function generateBetween(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function luminance(r: number, g: number, b: number): number {
	return 0.299 * r ** 2 + 0.587 * g ** 2 + 0.114 * b ** 2
}

export function hexConcat(r: number, g: number, b: number): string {
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function _generateRandomColor() {
	return new Resolvers.HSL(generateBetween(360, 0), generateBetween(100, 75), generateBetween(100, 65))
}

function _HEX(input: string) {
	if (!REGEXP.HEX.test(input)) return null
	let raw = REGEXP.HEX_EXEC.exec(input)![1]
	if (raw?.length === 3)
		raw = raw
			.split('')
			.map((char) => char + char)
			.join('')

	return new Resolvers.HEX(raw!.substring(0, 2), raw!.substring(2, 4), raw!.substring(4, 6))
}

function _RGB(input: string) {
	if (!REGEXP.RGB.test(input)) return null
	const raw = REGEXP.RGB_EXEC.exec(input)!
	return new Resolvers.RGB(parseInt(raw[1]!, 10), parseInt(raw[2]!, 10), parseInt(raw[3]!, 10))
}

function _HSL(input: string) {
	if (!REGEXP.HSL.test(input)) return null
	const raw = REGEXP.HSL_EXEC.exec(input)!
	return new Resolvers.HSL(parseInt(raw[1]!, 10), parseInt(raw[2]!, 10), parseInt(raw[3]!, 10))
}
