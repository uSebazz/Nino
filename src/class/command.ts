import { Command } from '@sapphire/framework';

export abstract class NinoCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
		});
	}
}
