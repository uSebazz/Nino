import { Command } from '@sapphire/framework'
import type { ApplicationCommandRegistry, CommandOptions, PieceContext } from '@sapphire/framework'

export abstract class NinoCommand extends Command {
	// eslint-disable-next-line no-useless-constructor
	public constructor(context: PieceContext, options: CommandOptions) {
		super(context, options)
	}
}

export type NinoCommandOptions = CommandOptions
export type NinoCommandRegistery = ApplicationCommandRegistry
