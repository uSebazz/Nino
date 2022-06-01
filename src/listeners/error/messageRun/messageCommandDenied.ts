import {
	Listener,
	type Events,
	type UserError,
	//type MessageCommandDeniedPayload,
} from '@sapphire/framework'

export class UserListener extends Listener<typeof Events.MessageCommandDenied> {
	public override run(
		error: UserError
		//{ message }: MessageCommandDeniedPayload
	) {
		this.container.logger.error(error)
	}
}
