import { translate } from '#lib/i18n';
import { Listener, type ChatInputCommandDeniedPayload, type Events, type UserError } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
	public override async run(error: UserError, { interaction, command }: ChatInputCommandDeniedPayload): Promise<void> {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		const silent = Reflect.get(Object(error.context), 'silent');
		const identifier = translate(error.identifier);

		return interaction.reply({
			content: await resolveKey(interaction, identifier, { interaction, command, ...(error.context as unknown) }),
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: Boolean(silent)
		});
	}
}
