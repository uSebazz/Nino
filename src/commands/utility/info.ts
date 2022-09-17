import type { NinoCommandRegistery } from '#lib/structures';
import { testServer } from '#root/config';
import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { RegisterBehavior } from '@sapphire/framework';

export class UserCommand extends Subcommand {
	public override registerApplicationCommands(registery: NinoCommandRegistery) {
		registery.registerChatInputCommand(
			(ctx) => {
				this.hooks.subcommands(this, ctx);

				return ctx //
					.setName('info')
					.setDescription('The subcommand patern of info commands.');
			},
			{
				guildIds: testServer,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		);
	}
}
