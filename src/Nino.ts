import { Nino } from './class/client'
import { container } from '@sapphire/framework'
;(async () => {
	const client = new Nino()
	try {
		container.logger.info('Connecting to Discord...')
		await client.start()
		container.logger.info('Connected to Discord!')
	} catch (e) {
		container.logger.error(e)
		client.destroy()
		process.exit(1)
	}
})().catch((e) => container.logger.error(e))
