import { Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { UserError, ChatInputCommandDeniedPayload } from '@sapphire/framework'

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
}
