import type { ApplicationCommandRegistry } from '@sapphire/framework'
import { type ChatInputCommand, Command, type Piece } from '@sapphire/framework'

export abstract class NinoCommand extends Command {
	public constructor(context: Piece.Context, options: ChatInputCommand.Options) {
		super(context, options)
	}
}

export type NinoCommandOptions = ChatInputCommand.Options
export type NinoCommandRegistery = ApplicationCommandRegistry
