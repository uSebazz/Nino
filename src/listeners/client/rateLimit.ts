import { Listener, type Events } from '@sapphire/framework'

export class rateLimitListener extends Listener<typeof Events.RateLimit> {
	public run(): void {
		this.container.logger.warn('Rate limit exceeded')
	}
}
