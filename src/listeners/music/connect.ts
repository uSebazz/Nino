import { container, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { ConnectEvent } from 'lavaclient'

@ApplyOptions<Listener.Options>({ event: 'connect', emitter: container.client.music })
export class connectListener extends Listener {
	public run(data: ConnectEvent): void {
		container.logger.info(
			`Connect to lavalink node ${data.took}ms, reconnect: ${
				data.reconnect ? 'yes' : 'no'
			}`
		)
	}
}
