import { container, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { ConnectEvent } from 'lavaclient'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'

@ApplyOptions<Listener.Options>({ event: 'connect', emitter: container.client.music })
export class connectListener extends Listener {
	public run(data: ConnectEvent): void {
		container.logger.info(
			`Connect to lavalink node ${data.took}ms, reconnect: ${
				data.reconnect ? 'yes' : 'no'
			}`
		)
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
