import { Listener, type Events } from '@sapphire/framework'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'

export class rateLimitListener extends Listener<typeof Events.RateLimit> {
	public run(): void {
		this.container.logger.warn('Rate limit exceeded')
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
