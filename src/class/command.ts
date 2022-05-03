import type { CacheType, CommandInteraction } from 'discord.js'
import type { ApplicationCommandRegistry } from '@sapphire/framework'
import { type ChatInputCommand, Command, type Piece } from '@sapphire/framework'

export abstract class NinoCommand extends Command {
	public constructor(context: Piece.Context, options: ChatInputCommand.Options) {
		super(context, options)
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NinoCommand {
	export type Options = ChatInputCommand.Options
	export type Interaction<Cache extends CacheType = CacheType> = CommandInteraction<Cache>
	export type Registry = ApplicationCommandRegistry
}
