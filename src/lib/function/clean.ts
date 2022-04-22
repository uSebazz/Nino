/**
 * @author https://github.com/favware/dragonite/blob/3a04bde2da234b5b51a2c43b416488c69edff8ea/src/lib/util/Sanitizer/clean.ts
 */

import { regExpEsc } from '@sapphire/utilities'

let sensitivePattern: string | RegExp
const zws = String.fromCharCode(8203)

/**
 * Cleans sensitive info from strings
 * @since 0.0.1
 * @param text The text to clean
 */
export function clean(text: string) {
	return text
		.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」')
		.replace(/`/g, `\`${zws}`)
		.replace(/@/g, `@${zws}`)
}

/**
 * Initializes the sensitive patterns for clean()
 * @param tokens The tokens to clean
 */
export function initClean(tokens: readonly string[]) {
	sensitivePattern = new RegExp(tokens.map(regExpEsc).join('|'), 'gi')
}
