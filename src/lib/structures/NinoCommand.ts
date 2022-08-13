import type { ApplicationCommandRegistry, CommandOptions, PieceContext } from '@sapphire/framework';
import { Command } from '@sapphire/framework';

export abstract class NinoCommand extends Command {
	public constructor(context: PieceContext, options: CommandOptions) {
		super(context, options);
	}
}

export type NinoCommandOptions = CommandOptions;
export type NinoCommandRegistery = ApplicationCommandRegistry;
