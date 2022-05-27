import '#lib/setup'
import { Nino } from '#lib/structures/NinoClient'
import { container } from '@sapphire/framework'
	; (async () => {
		const client = new Nino()
		try {
			await client.start()
			container.logger.info(`Connected in Discord as ${client.user!.tag}`)
		} catch (e) {
			container.logger.error(e)
			client.destroy()
			process.exit(1)
		}
	})().catch((error) => console.log(error))
