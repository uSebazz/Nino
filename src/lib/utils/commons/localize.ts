import { container } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Guild } from 'discord.js';

export async function getCommandList(t: Guild, category: string) {
	// const locale = await fetchLanguage(t)
	const command = container.stores.get('commands').filter((c) => c.category === category);
	const map = await Promise.all(
		command.map(async (cmd) => {
			const descriptionLocalized = await resolveKey(t, cmd.description);

			return `${cmd.name} - ${descriptionLocalized}`;
		})
	);

	return map.sort(sortCommandsAllphabetic);
}

export function sortCommandsAllphabetic(firstValue: string, secondValue: string): 1 | -1 | 0 {
	if (firstValue > secondValue) return 1;
	if (secondValue > firstValue) return -1;
	return 0;
}

export function localizeChannelTypes(channelType: string) {
	switch (channelType) {
		default:
			return `channels:${channelType}`;
	}
}
