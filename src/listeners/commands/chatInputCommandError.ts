import { Listener, type ChatInputCommandErrorPayload, type Events } from '@sapphire/framework'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'

export class chatInputCommandErrorListener extends Listener<typeof Events.ChatInputCommandError> {
	public override run(error: Error, { command }: ChatInputCommandErrorPayload): void {
		this.container.logger.fatal(
			`An error occurred while executing the command ${command.name}: ${error.message}`
		)
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
