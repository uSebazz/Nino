import { ALLOWED_SERVERS } from '#root/config';
import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { RegisterBehavior } from '@sapphire/framework';

export class UserCommand extends Subcommand {
	public override registerApplicationCommands(registery: Subcommand.Registry) {
		registery.registerChatInputCommand(
			(ctx) => {
				this.hooks.subcommands(this, ctx);

				return ctx //
					.setName('info')
					.setDescription('The subcommand patern of info commands.');
			},
			{
				guildIds: ALLOWED_SERVERS,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		);
	}
}
