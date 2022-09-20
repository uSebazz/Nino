import { CLIENT_OPTIONS } from '#root/config';
import { PrismaClient } from '@prisma/client';
import { container, SapphireClient } from '@sapphire/framework';

export class Nino extends SapphireClient {
	public readonly dev: boolean = process.env.NODE_ENV === 'development';

	public constructor() {
		super(CLIENT_OPTIONS);

		container.prisma = new PrismaClient();
	}

	public async start() {
		await super.login();
		await container.prisma.$connect().then(() => {
			container.logger.info('Connected to Prisma');
		});
	}

	public override async destroy() {
		await container.prisma.$disconnect();
		return super.destroy();
	}
}
