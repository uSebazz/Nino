import { Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { VoiceStateUpdate } from 'lavaclient'

@ApplyOptions<Listener.Options>({ event: 'VoiceStateUpdate', emitter: 'ws' })
export class VoiceStateUpdateListener extends Listener {
	public run(data: VoiceStateUpdate): void {
		this.container.client.music.handleVoiceUpdate(data)
	}
}
