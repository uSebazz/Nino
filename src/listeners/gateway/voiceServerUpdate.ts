import { Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { GatewayDispatchEvents } from 'discord-api-types'
import type { VoiceStateUpdate } from 'lavaclient'

@ApplyOptions<Listener.Options>({ event: GatewayDispatchEvents.VoiceServerUpdate, emitter: 'ws' })
export class VoiceServerUpdateListener extends Listener {
	public run(data: VoiceStateUpdate): void {
		this.container.client.music.handleVoiceUpdate(data)
	}
}
