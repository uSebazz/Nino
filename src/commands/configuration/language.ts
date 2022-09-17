import { LanguageKeys } from '#lib/i18n';
import { RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { Language } from '@prisma/client';
import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { CommandInteraction } from 'discord.js';

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
export class UserCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction<'cached'>) {
		const locale = interaction.options.getString('locale') as Language;
		console.log(locale);
		return this.setLocale(locale, interaction);
	}

	private async setLocale(locale: Language, interaction: CommandInteraction<'cached'>) {
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
