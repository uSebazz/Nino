import { NinoCommandRegistery } from '#lib/structures';
import { testServer } from '#root/config';
import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { RegisterBehavior } from '@sapphire/framework';

@ApplyOptions<Subcommand.Options>({
	description: 'The subcommand patern of config commands.',
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
				guildIds: testServer,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		);
	}
}
