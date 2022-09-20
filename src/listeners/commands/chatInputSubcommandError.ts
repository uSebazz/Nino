import { Events, Listener, UserError } from '@sapphire/framework';
import type { ChatInputSubcommandErrorPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';

export class UserListener extends Listener<typeof SubcommandPluginEvents.ChatInputSubcommandError> {
	public run(error: UserError, payload: ChatInputSubcommandErrorPayload) {
		return this.container.client.emit(Events.ChatInputCommandDenied, error, payload);
	}
}
