import type { NinoCommandRegistery } from '#lib/structures';
import { ALLOWED_SERVERS } from '#root/config';
import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { RegisterBehavior } from '@sapphire/framework';

@ApplyOptions<Subcommand.Options>({
	preconditions: ['GuildOnly', 'Administrator']
})
export class UserCommand extends Subcommand {
	public override registerApplicationCommands(registery: NinoCommandRegistery) {
		registery.registerChatInputCommand(
			(ctx) => {
				// SubcommandGroup
				ctx.addSubcommandGroup((sc) =>
					sc //
						.setName('logging')
						.setDescription('Pattern of logging commands.')
				);

				// Hooks
				this.hooks.groups(this, ctx);
				this.hooks.subcommands(this, ctx);

				// command
				return ctx.setName('config').setDescription('The subcommand patern of config commands.');
			},
			{
				guildIds: ALLOWED_SERVERS,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		);
	}
}
