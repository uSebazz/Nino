import type { CacheType, CommandInteraction } from 'discord.js';
import {
	Command,
	ApplicationCommandRegistry,
	type Piece,
	type ChatInputCommand,
} from '@sapphire/framework';

export abstract class NinoCommand extends Command {
	public constructor(context: Piece.Context, options: ChatInputCommand.Options) {
		super(context, options);
	}

	public abstract override chatInputRun(
		interaction: CommandInteraction,
		context: ChatInputCommand.RunContext
	): unknown;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NinoCommand {
	export type Options = ChatInputCommand.Options;
	export type Int<Cache extends CacheType = CacheType> = CommandInteraction<Cache>;
	export type Registry = ApplicationCommandRegistry;
}
