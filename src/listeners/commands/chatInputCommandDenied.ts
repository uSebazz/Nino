import { Listener, type Events, type UserError, type ChatInputCommandDeniedPayload } from '@sapphire/framework';

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
	public override async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		await interaction.reply(error.message);
	}
}
