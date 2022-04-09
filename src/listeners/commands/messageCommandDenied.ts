import { Listener, type MessageCommandDeniedPayload, type UserError } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'

@ApplyOptions<Listener.Options>({ event: 'messageCommandDenied' })
export class messageCommandDenied extends Listener {
	public override async run(
		error: UserError,
		{ message }: MessageCommandDeniedPayload
	): Promise<void> {
		await message.reply({ content: error.message })
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
