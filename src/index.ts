import { Nino } from './class/Client';
import { env } from './lib/function/env';
import { container } from '@sapphire/framework';

(async () => {
	const client = new Nino();
	try {
		client.start(env.token);
	} catch (e) {
		console.log(container.logger.error(e));
		client.destroy();
		process.exit(1);
	}
})().catch((e) => container.logger.error(e));
