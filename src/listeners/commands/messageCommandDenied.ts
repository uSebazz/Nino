import { Listener, type MessageCommandDeniedPayload, type UserError } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Listener.Options>({ event: 'messageCommandDenied' })
export class messageCommandDenied extends Listener {
	public override async run(
		error: UserError,
		{ message }: MessageCommandDeniedPayload
	): Promise<void> {
		await message.reply({ content: error.message })
	}
}
