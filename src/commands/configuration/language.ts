import { LanguageKeys } from '#lib/i18n';
import { NinoCommand } from '#lib/structures';
import { RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { Language } from '@prisma/client';
import { resolveKey } from '@sapphire/plugin-i18next';

@RegisterSubCommand('config', (builder) =>
	builder
		.setName('language')
		.setDescription('🗨 Configure the language of the bot for this guild.')
		.addStringOption((option) =>
			option
				.setName('locale')
				.setDescription('🗣 The new language for this guild.')
				.addChoices(
					{
						name: 'Español',
						value: Language.ES
					},
					{
						name: 'English',
						value: Language.EN
					},
					{
						name: 'Deutsch',
						value: Language.DE
					}
				)
				.setRequired(true)
		)
)
export class UserCommand extends NinoCommand {
	public override chatInputRun(interaction: NinoCommand.Interaction<'cached'>) {
		const locale = interaction.options.getString('locale') as Language;
		console.log(locale);
		return this.setLocale(locale, interaction);
	}

	private async setLocale(locale: Language, interaction: NinoCommand.Interaction<'cached'>) {
		const id = BigInt(interaction.guildId);
		const data = await this.container.prisma.guild.findUnique({
			where: {
				id
			}
		});

		if (data?.lang === locale) {
			return interaction.reply(await resolveKey(interaction, LanguageKeys.Config.Language.AlreadyLanguage));
		}

		await this.container.prisma.guild.upsert({
			where: {
				id
			},
			update: {
				lang: {
					set: locale
				}
			},
			create: {
				id,
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
