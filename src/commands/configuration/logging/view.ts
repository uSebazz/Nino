import { LanguageKeys } from '#lib/i18n';
import { NinoCommand } from '#lib/structures';
import { Colors } from '#utils/constants';
import { inlineCode } from '@discordjs/builders';
import { RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced';
import { Event } from '@prisma/client';
import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
import { resolveKey } from '@sapphire/plugin-i18next';
import { MessageEmbed } from 'discord.js';

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder //
		.setName('view')
		.setDescription('👤 Display logging system current configuration')
)
export class UserCommand extends NinoCommand {
	public override chatInputRun(interaction: NinoCommand.Interaction<'cached'>) {
		return this.showInfo(interaction);
	}

	private async showInfo(interaction: NinoCommand.Interaction<'cached'>) {
		const data = await this.container.prisma.guild.findFirst({
			where: {
				id: BigInt(interaction.guildId)
			},
			include: {
				logs: true
			}
		});

		if (!data) {
			this.error(LanguageKeys.Config.Logging.NoDataFound);
		}

		const formatedData = await Promise.all(
			data.logs.map(async (log) => {
				const channel = await resolveKey(interaction, LanguageKeys.Config.Logging.ViewChannelInfo, {
					channel: `<#${log.channelId}>`
				});

				const events = log.events.includes(Event.all)
					? await resolveKey(interaction, LanguageKeys.Config.Logging.AllEvents)
					: log.events.map((event) => inlineCode(event)).join(', ') || '-';

				return `${channel}\n${await resolveKey(interaction, LanguageKeys.Config.Logging.ViewEventsInfo, { events })}\n`;
			})
		);

		const paginated = new PaginatedFieldMessageEmbed<typeof formatedData[0]>()
			.setTitleField(await resolveKey(interaction, LanguageKeys.Config.Logging.ViewInfo))
			.setItems(formatedData)
			.setItemsPerPage(5)
			.setTemplate(this.embedTemplate)
			.make();

		return paginated.run(interaction, interaction.user);
	}

	private get embedTemplate() {
		return new MessageEmbed()
			.setThumbnail(this.container.client.user!.displayAvatarURL({ size: 128, format: 'png', dynamic: true }))
			.setColor(Colors.hazyDaze)
			.setTimestamp();
	}
}
