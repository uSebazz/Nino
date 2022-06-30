import { CLIENT_OPTIONS } from '#root/config'
import { PrismaClient } from '@prisma/client'
import { container, SapphireClient } from '@sapphire/framework'

export class Nino extends SapphireClient {
	public constructor() {
		super(CLIENT_OPTIONS)

		container.prisma = new PrismaClient()
	}

	public async start() {
		await super.login()
		await container.prisma.$connect().then(() => {
			container.logger.info('Connected to Prisma')
		})
	}
}
