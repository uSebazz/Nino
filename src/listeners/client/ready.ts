import { ApplyOptions } from '@sapphire/decorators'
import { Listener, type Events, type Store } from '@sapphire/framework'
import { envParseString } from '@skyra/env-utilities'
import { createBanner } from '@skyra/start-banner'
import { blue, gray, yellow } from 'colorette'
import gradient from 'gradient-string'


@ApplyOptions<Listener.Options>({ event: 'ready', once: true })
export class readyListener extends Listener<typeof Events.ClientReady> {
	public readonly style = this.isDev ? yellow : blue

	public run() {
		this.printBanner()
		this.printStoreDebugInformation()
	}

	private printBanner() {
		console.log(
			gradient.cristal.multiline(
				createBanner({
					logo: [
						String.raw` ⟋|､`,
						String.raw`(°､ ｡ 7`,
						String.raw` |､  ~ヽ`,
						String.raw` じしf_,)〳`
					],
					name: [
						String.raw`  Nino Bot v2.0.3`,
					],
					extra: [
						'  [+] Gateway',
						this.isDev ? ' </> DEVELOPMENT MODE' : ''
					]
				})
			)
		)
	}

	private get isDev() {
		return envParseString('NODE_ENV') === 'development'
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
		return gray(
			`${last ? '└─' : '├─'} Loaded ${this.style(
				store.size.toString().padEnd(3, ' ')
			)} ${store.name}.`
		)
	}
}
