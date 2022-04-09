import { Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { VoiceStateUpdate } from 'lavaclient'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'

@ApplyOptions<Listener.Options>({ event: 'VoiceStateUpdate', emitter: 'ws' })
export class VoiceStateUpdateListener extends Listener {
	public run(data: VoiceStateUpdate): void {
		this.container.client.music.handleVoiceUpdate(data)
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
