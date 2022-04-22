import { Listener, type Events } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { Client } from 'discord.js'

@ApplyOptions<Listener.Options>({ event: 'ready', once: true })
export class readyListener extends Listener<typeof Events.ClientReady> {
	public run(client: Client): void {
		this.container.logger.info(`Logged in as ${client.user?.tag as string}`)
	}
}
