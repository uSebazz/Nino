import { Listener, type Events } from '@sapphire/framework';
import { cyan } from 'colorette';
import type { RateLimitData } from 'discord.js';

export class rateLimitListener extends Listener<typeof Events.RateLimit> {
	public run({ timeout, limit, method, path, route, global }: RateLimitData): void {
		const rateTime = this.timeout(timeout);
		const rateLimit = this.limit(limit);
		const rateMethod = this.method(method);
		const ratePath = this.path(path);
		const rateRoute = this.route(route);
		const rateGlobal = this.global(global);

		this.container.logger.info(
			`Rate limit reached! t: ${rateTime} l: ${rateLimit} m: ${rateMethod} p: ${ratePath} r: ${rateRoute} g: ${rateGlobal}`
		);
	}

	private timeout(time: number): string {
		return `[${cyan(time.toString())}]`;
	}

	private limit(limit: number): string {
		return `[${cyan(limit.toString())}]`;
	}

	private method(method: string): string {
		return `[${cyan(method.toString())}]`;
	}

	private path(path: string): string {
		return `[${cyan(path.toString())}]`;
	}

	private route(route: string): string {
		return `[${cyan(route.toString())}]`;
	}

	private global(global: boolean): string {
		return `[${cyan(global.toString())}]`;
	}
}
