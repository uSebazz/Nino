import { Listener, type Events } from '@sapphire/framework'

export class UserListener extends Listener<typeof Events.MessageBulkDelete> {
	public override run() {
		//
	}
}
