import { Nino } from './class/client';
import { env } from './lib/function/env';
import { container } from '@sapphire/framework';

(async () => {
	const client = new Nino();
	try {
		await client.start(env.token);
	} catch (e) {
		container.logger.error(e);
		client.destroy();
		process.exit(1);
	}
})().catch((e) => container.logger.error(e));
