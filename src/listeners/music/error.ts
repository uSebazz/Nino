import { container, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Listener.Options>({ event: 'error', emitter: container.client.music })
export class errorListener extends Listener {
	public run(error: Error): void {
		container.logger.error(error)
	}
}
