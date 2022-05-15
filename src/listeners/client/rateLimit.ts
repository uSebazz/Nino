import { Listener, type Events } from '@sapphire/framework'
import { cyan } from 'colorette'
import type { RateLimitData } from 'discord.js'

export class rateLimitListener extends Listener<typeof Events.RateLimit> {
	public run({ timeout }: RateLimitData): void {
		const time = this.timeout(timeout)

		this.container.logger.warn(`timeout: ${time}`)
	}

	private timeout(time: number) {
		return `[${cyan(time.toString())}]`
	}
}
