import { NinoCommand, type NinoCommandRegistery, type NinoCommandOptions } from '#class/command'
import { testServer } from '#root/config'
import { ApplyOptions } from '@sapphire/decorators'
//import { send } from '@sapphire/plugin-editable-commands'
import type { Args } from '@sapphire/framework'
import type { Message } from 'discord.js'

@ApplyOptions<NinoCommandOptions>({
	description: 'Configure the bot, or a specific setting.',
	aliases: ['config', 'configure', 'settings', 'setting'],
	options: ['language', 'lang'],
})
export class configCommand extends NinoCommand {
	public override registerApplicationCommands(registry: NinoCommandRegistery): void {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		),
			{
				guildIds: testServer,
				idHints: ['959115551974756402'],
			}
	}

	// eslint-disable-next-line consistent-return
	public override messageRun(message: Message, args: Args) {
		const language = args.getOption('language') ?? args.getOption('lang')

		if (language) {
			return this.languageConfig(message, {
				language: language as 'es-ES' | 'en-US',
			})
		}
	}

	private languageConfig(_message: Message, options: LanguageConfigOptions) {
		switch (options.language) {
			case 'es-ES':
				break
			case 'en-US':
				break
		}
	}
}

export interface LanguageConfigOptions {
	language: 'es-ES' | 'en-US'
}
