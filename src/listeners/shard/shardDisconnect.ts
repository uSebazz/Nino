import { Listener, type Events } from '@sapphire/framework';
import { cyan } from 'colorette';
import type { CloseEvent } from 'discord.js';

export class ShardDisconnect extends Listener<typeof Events.ShardDisconnect> {
	public override run(event: CloseEvent, sharId: number) {
		this.container.client.logger.info(`Shard [${cyan(sharId)}] disconnected. code: ${event.code} reason: ${event.reason}`);
	}
}
