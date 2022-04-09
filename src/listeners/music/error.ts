import { container, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'

@ApplyOptions<Listener.Options>({ event: 'error', emitter: container.client.music })
export class errorListener extends Listener {
	public run(error: Error): void {
		container.logger.error(error)
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
