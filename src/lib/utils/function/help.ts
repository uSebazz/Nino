import { container } from '@sapphire/framework'

export function getCommandList(category: string) {
	const cmd = container.stores.get('commands')
	const filter = cmd.filter((c) => c.category === category)
	const map = filter.map((c) => `${c.name} - ${c.description}`)

	return map.sort(sortCommandsAllphabetic)
}

export function sortCommandsAllphabetic(firstValue: string, secondValue: string): 1 | -1 | 0 {
	if (firstValue > secondValue) return 1
	if (secondValue > firstValue) return -1
	return 0
}
