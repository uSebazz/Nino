import type { NinoCommandRegistery } from '#lib/structures'
import { testServer } from '#root/config'
import { Subcommand } from '@kaname-png/plugin-subcommands-advanced'
import { ApplyOptions } from '@sapphire/decorators'
import { RegisterBehavior } from '@sapphire/framework'

@ApplyOptions<Subcommand.Options>({
	description: 'Configure the logging system for the bot.',
	preconditions: ['GuildOnly', 'Administrator']
})
export class UserCommand extends Subcommand {
	public override registerApplicationCommands(registery: NinoCommandRegistery) {
		registery.registerChatInputCommand(
			(builder) => {
				this.hooks.subcommands(this, builder)

				return builder //
					.setName(this.name)
					.setDescription(this.description)
			},
			{
				guildIds: testServer,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		)
	}
}
