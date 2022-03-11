import { Listener } from '@sapphire/framework';
import chalk from 'chalk';

export class ReadyListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: 'ready',
		});
	}
	async run() {
		const client = this.container.client;

		let { tag } = client.user!;
		client.music.connect(client.user!.id);
		console.log(chalk.blue(new Date().toLocaleString()}), `| Initialized ${tag} successfully`)
