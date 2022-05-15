import { Listener, type ListenerOptions, type Events } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { UserError } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({ event: 'chatInputCommandDenied' })
export class chatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
	public override run(error: UserError) {
		console.log(error)
	}
}
