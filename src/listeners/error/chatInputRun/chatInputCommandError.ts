import { Listener, type ChatInputCommandErrorPayload, type Events } from '@sapphire/framework'

export class chatInputCommandErrorListener extends Listener<typeof Events.ChatInputCommandError> {
	public override run(error: Error, { command }: ChatInputCommandErrorPayload) {
		this.container.logger.fatal(`An error occurred while executing the command ${command.name}: ${error.message}`)
	}
}
