import { logSuccessCommand } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandSuccessPayload, Events, Listener, ListenerOptions, Logger, LogLevel } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
	event: Events.ChatInputCommandSuccess
})
export class ChatInputCommandSuccess extends Listener<typeof Events.ChatInputCommandSuccess> {
	public run(payload: ChatInputCommandSuccessPayload): void {
		return logSuccessCommand(payload);
	}

	public override onLoad(): unknown {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
