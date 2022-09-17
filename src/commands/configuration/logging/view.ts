import { LanguageKeys } from '#lib/i18n';
import { inlineCode } from '@discordjs/builders';
import { Command, RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced';
import { Event } from '@prisma/client';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { CommandInteraction, Message } from 'discord.js';

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder //
		.setName('view')
		.setDescription('👤 Display logging system current configuration')
)
export class UserCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction<'cached'>) {
		return this.showInfo(interaction);
	}

	public override messageRun(message: Message<true>) {
		return this.showInfo(message);
	}

	private async showInfo(interaction: CommandInteraction<'cached'> | Message<true>) {
		const data = await this.container.prisma.logChannel.findUnique({
			where: {
				guildId: BigInt(interaction.guildId)
			}
		});

		if (!data) {
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.NoDataFound));
		}

		const events = data.events.includes(Event.all)
			? await resolveKey(interaction, LanguageKeys.Config.Logging.AllEvents)
			: data.events.map((event) => inlineCode(event)).join(', ') || '-';

		return interaction.reply(
			await resolveKey(interaction, LanguageKeys.Config.Logging.ViewInfo, {
				channel: data.channelId ? `<#${data.channelId}>` : 'none',
				events
			})
		);
	}
}
