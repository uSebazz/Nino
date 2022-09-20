import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplicationCommandRegistry, UserError } from '@sapphire/framework';
import type { CacheType } from 'discord.js';

export abstract class NinoCommand extends Command {
	public constructor(context: NinoCommand.Context, options: NinoCommand.Options) {
		super(context, options);
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
	}
}

export namespace NinoCommand {
	export type Context = Command.Context;
	export type Options = Command.Options;
	export type Interaction<Cached extends CacheType = CacheType> = Command.ChatInputInteraction<Cached>;
	export type ContextMenuInteraction<Cached extends CacheType = CacheType> = Command.ContextMenuInteraction<Cached>;
	export type Registry = Command.Registry;
	export type RegisterOptions = ApplicationCommandRegistry.RegisterOptions;
}
