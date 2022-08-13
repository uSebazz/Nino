import '#lib/setup';
import { Nino } from '#lib/structures';
import { container } from '@sapphire/framework';

const main = async () => {
	const client = new Nino();
	try {
		await client.start();
		container.logger.info(`Logged in Discord as ${client.user!.tag}`);
	} catch (error) {
		container.logger.fatal(error);
		await container.prisma.$disconnect();
	}
};

void main();

process.on('unhandledRejection', (error) => {
	container.logger.error(error);
});
