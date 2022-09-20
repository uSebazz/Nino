import { logSuccessCommand } from '#utils/util';
import { ChatInputCommandSuccessPayload, Events, Listener, Logger, LogLevel } from '@sapphire/framework';

export class ChatInputCommandSuccess extends Listener<typeof Events.ChatInputCommandSuccess> {
	public run(payload: ChatInputCommandSuccessPayload): void {
		return logSuccessCommand(payload);
	}

	public override onLoad(): unknown {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
