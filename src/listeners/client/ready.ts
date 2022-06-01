/* eslint-disable no-mixed-spaces-and-tabs */
import { Listener, type Store, type Events } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { createBanner } from '@skyra/start-banner'
import colors from '@colors/colors'
import gradient from 'gradient-string'

const dev = process.env.NODE_ENV === 'development'
@ApplyOptions<Listener.Options>({ event: 'ready', once: true })
export class readyListener extends Listener<typeof Events.ClientReady> {
	public readonly style = dev ? colors.yellow : colors.blue

	public run() {
		this.printBanner()
		this.printStoreDebugInformation()
	}

	private printBanner() {
		console.log(
			gradient.summer.multiline(
				createBanner({
					logo: [
						String.raw`       \`*-.                    `,
						String.raw`        )  _\`-.                 `,
						String.raw`       .  : \`. .                `,
						String.raw`       : _   '  \               `,
						String.raw`       ; *\` _.   \`*-._          `,
						String.raw`       \`-.-'          \`-.       `,
						String.raw`         ;       \`       \`.     `,
						String.raw`         :.       .        \    `,
						String.raw`         . \  .   :   .-'   .   `,
						String.raw`         '  \`+.;  ;  '      :   `,
						String.raw`         :  '  |    ;       ;-. `,
						String.raw`         ; '   : :\`-:     _.\`* ;`,
						String.raw`       .*' /  .*' ; .*\`- +'  \`*' `,
						String.raw`      \`*-*   \`*-*  \`*-*'`,
					],
					name: [
						String.raw` _   _ _             `,
						String.raw` | \ | (_)_ __   ___  `,
						String.raw` |  \| | | '_ \ / _ \ `,
						String.raw` | |\  | | | | | (_) |`,
						String.raw` |_| \_|_|_| |_|\___/ `,
					],
				})
			)
		)
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container
		const stores = [...client.stores.values()]
		const last = stores.pop()!

		for (const store of stores) logger.info(this.styleStore(store, false))
		logger.info(this.styleStore(last, true))
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private styleStore(store: Store<any>, last: boolean) {
		return colors.gray(
			`${last ? '└─' : '├─'} Loaded ${this.style(
				store.size.toString().padEnd(3, ' ')
			)} ${store.name}.`
		)
	}
}
