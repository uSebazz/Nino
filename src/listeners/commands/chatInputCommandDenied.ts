import { Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { UserError, ChatInputCommandDeniedPayload } from '@sapphire/framework'
import { gray, white } from 'colorette'
import { Timestamp } from '@sapphire/time-utilities'

@ApplyOptions<Listener.Options>({ event: 'chatInputCommandDenied' })
export class chatInputCommandDeniedListener extends Listener {
	public override async run(
		error: UserError,
		{ interaction }: ChatInputCommandDeniedPayload
	): Promise<void> {
		await interaction.reply({
			content: error.message,
		})
	}
	public override onLoad(): void {
		const timestamp = new Timestamp('YYYY-MM-DD HH:mm:ss')
		const date = new Date()
		const result = timestamp.displayUTC(date)
		console.log(gray(result), white('SILLY'), `Listener "${this.name}" loaded`)
	}
}
