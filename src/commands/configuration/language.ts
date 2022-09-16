import { LanguageKeys } from '#lib/i18n';
import { RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { CommandInteraction } from 'discord.js';

@RegisterSubCommand('config', (ctx) =>
	ctx //
		.setName('language')
		.setDescription('🗨 Configure the language of the bot for this guild.')
		.addStringOption((op) =>
			op //
				.setName('locale')
				.setDescription('🗣 The new language for this guild.')
				.addChoices(
					{
						name: 'Español',
						value: 'es-ES'
					},
					{
						name: 'English',
						value: 'en-US'
					},
					{
						name: 'Deutsch',
						value: 'de-DE'
					}
				)
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(ctx: CommandInteraction) {
		const locale = ctx.options.getString('locale') as AllLocales;
		return this.setLocale(locale, ctx);
	}

	private async setLocale(locale: AllLocales, interaction: CommandInteraction) {
		const data = await this.container.prisma.serverConfig.findUnique({
			where: {
				guildId: interaction.guildId!
			}
		});

		if (data?.lang === locale) {
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Language.AlreadyLanguage));
		}

		await this.container.prisma.serverConfig.update({
			where: {
				guildId: interaction.guildId!
			},
			data: {
				lang: locale
			}
		});

		return interaction.reply(
			await resolveKey(interaction, LanguageKeys.Config.Language.LanguageSet, {
				lang: locale
			})
		);
	}
}

type AllLocales = 'es-ES' | 'en-US' | 'de-DE';
