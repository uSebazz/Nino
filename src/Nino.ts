import '#lib/setup'
import { Nino } from '#lib/structures'
import { container } from '@sapphire/framework'

const client = new Nino()

const main = async () => {
	try {
		container.logger.info('Connecting to Discord...')
		await client.start()
		container.logger.info('Connected to Discord!')
	} catch (e) {
		container.logger.error(e)
		client.destroy()
		process.exit(1)
	}
}

void main()
