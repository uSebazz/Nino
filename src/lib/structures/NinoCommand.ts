import { ApplicationCommandRegistry, Command, CommandOptions, PieceContext } from '@sapphire/framework';

export abstract class NinoCommand extends Command {
	public constructor(context: PieceContext, options: CommandOptions) {
		super(context, options);
	}
}

export type NinoCommandOptions = CommandOptions;
export type NinoCommandRegistery = ApplicationCommandRegistry;
