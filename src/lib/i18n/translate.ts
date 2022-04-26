import { Identifiers } from '@sapphire/framework'

export function translate(identifier: string) {
	switch (identifier) {
		case Identifiers.ArgsMissing:
			return 'arguments:missing'
		default:
			return identifier
	}
}
