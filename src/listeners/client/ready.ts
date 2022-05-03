import { Listener, type Store, type Events } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette'
import { env } from '#utils/function/env'

const dev = env.NODE_PROCESS === 'development'

@ApplyOptions<Listener.Options>({ event: 'ready', once: true })
export class readyListener extends Listener<typeof Events.ClientReady> {
	public readonly style = dev ? yellow : blue

	public run() {
		this.printBanner()
		this.printStoreDebugInformation()
	}

	private printBanner() {
		const success = green('+')

		const llc = dev ? magentaBright : white
		const blc = dev ? magenta : blue

		const line01 = llc('  ')
		const line02 = llc('')
		const line03 = llc('')
		const pad = ' '.repeat(7)

		console.log(
			String.raw`
${line01} ${pad}${blc('2.0.2')}
${line02} ${pad}[${success}] Gateway
${line03}${
				dev
					? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}`
					: `${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('PRODUCTION MODE')}`
			}
		`.trim()
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
		return gray(
			`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${
				store.name
			}.`
		)
	}
}
