import { LanguageKeys } from '#lib/i18n';
import { inlineCode } from '@discordjs/builders';
import { Command, RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { CommandInteraction, Message } from 'discord.js';

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder //
		.setName('view')
		.setDescription('View the current logging configuration')
)
export class UserCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		return this.showInfo(interaction);
	}

	public override messageRun(message: Message) {
		return this.showInfo(message);
	}

	private async showInfo(interaction: CommandInteraction | Message) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: interaction.guildId!
			}
		});

		if (!data) {
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Logging.NoDataFound));
		}

		const events = data.all
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
