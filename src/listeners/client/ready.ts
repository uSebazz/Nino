import { Listener, type Events } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'
import type { Client } from 'discord.js'

@ApplyOptions<Listener.Options>({ event: 'ready', once: true })
export class readyListener extends Listener<typeof Events.ClientReady> {
	public run(client: Client): void {
		this.container.logger.info(`Logged in as ${client.user?.tag as string}`)
		this.container.client.music.connect(client.user?.id)
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
