import { Listener, type Events } from '@sapphire/framework'
import type { CloseEvent } from 'discord.js'

export class ShardDisconnect extends Listener<typeof Events.ShardDisconnect> {
	public override run(event: CloseEvent, sharId: number) {
		this.container.client.logger.info(`Shard [${sharId}] disconnected. code: ${event.code} reason: ${event.reason}`)
	}
}
