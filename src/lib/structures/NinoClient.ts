import { SapphireClient, container } from '@sapphire/framework'
import { envParseString } from '@skyra/env-utilities'
import { CLIENT_OPTIONS } from '#root/config'
import { PrismaClient } from '@prisma/client'

export class Nino extends SapphireClient {
	public constructor() {
		super(CLIENT_OPTIONS)

		container.prisma = new PrismaClient()
	}

	public async start() {
		await super.login(envParseString('DISCORD_TOKEN'))
		await container.prisma.$connect().then(() => {
			container.logger.info('Connected to Prisma 🔹')
		})
	}
}
