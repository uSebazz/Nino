import { Listener, type Events } from '@sapphire/framework'
import colors from '@colors/colors'
import type { RateLimitData } from 'discord.js'

export class rateLimitListener extends Listener<typeof Events.RateLimit> {
	public run({
		timeout,
		limit,
		method,
		path,
		route,
		global,
	}: RateLimitData): void {
		const rateTime = this.timeout(timeout)
		const rateLimit = this.limit(limit)
		const rateMethod = this.method(method)
		const ratePath = this.path(path)
		const rateRoute = this.route(route)
		const rateGlobal = this.global(global)

		this.container.logger.info(
			`Rate limit reached! t: ${rateTime} l: ${rateLimit} m: ${rateMethod} p: ${ratePath} r: ${rateRoute} g: ${rateGlobal}`
		)
	}

	private timeout(time: number) {
		return `[${colors.cyan(time.toString())}]`
	}

	private limit(limit: number) {
		return `[${colors.cyan(limit.toString())}]`
	}

	private method(method: string) {
		return `[${colors.cyan(method.toString())}]`
	}

	private path(path: string) {
		return `[${colors.cyan(path.toString())}]`
	}

	private route(route: string) {
		return `[${colors.cyan(route.toString())}]`
	}

	private global(global: boolean) {
		return `[${colors.cyan(global.toString())}]`
	}
}
