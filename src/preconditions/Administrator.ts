import { LanguageKeys } from '#lib/i18n';
import { RequiresGuildContext } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { CommandInteraction } from 'discord.js';

export class Administrator extends Precondition {
	@RequiresGuildContext()
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		const message = await resolveKey(interaction, LanguageKeys.Precondition.RequireAdminPermission);

		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return this.error({ message });
		}

		return this.ok();
	}
}
