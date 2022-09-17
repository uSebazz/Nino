import { LanguageKeys } from '#lib/i18n';
import { sendLocalizedTemporaryMessage } from '#utils/util';
import { Listener, type Events } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserListener extends Listener<typeof Events.MentionPrefixOnly> {
	public override run(message: Message): Promise<() => Promise<void>> | undefined {
		if (message.author.bot) return;
		if (message.author.system) return;

		return sendLocalizedTemporaryMessage(message, LanguageKeys.Messages.Mention);
	}
}
