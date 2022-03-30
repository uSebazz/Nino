import { container, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Listener.Options>({ event: 'disconnect', emitter: container.client.music })
export class disconnectListener extends Listener {
	public run(reason: string): void {
		container.logger.debug(`Disconnected from Lavalink: ${reason}`)
	}
}
