import { Listener } from '@sapphire/framework';
import colors from 'colors';

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
		console.log(colors.blue(`${new Date().toLocaleString()}`), `| ${tag} is now On!`);
	}
}
