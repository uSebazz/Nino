import { NinoCommand, type NinoCommandOptions } from '#lib/structures'
import { Colors, Emojis } from '#utils/constants'
import { version as sapphireVersion } from '@sapphire/framework'
import { version as discordVersion, MessageEmbed, MessageActionRow, MessageButton, type CommandInteraction, type Message } from 'discord.js'
import { ApplyOptions } from '@sapphire/decorators'
import { roundNumber } from '@sapphire/utilities'
import { resolveKey } from '@sapphire/plugin-i18next'
import { cpus, type CpuInfo } from 'node:os'
import { reply } from '@sapphire/plugin-editable-commands'
import { LanguageKeys } from '#lib/i18n'

@ApplyOptions<NinoCommandOptions>({
	description: 'shows nino statics',
	chatInputCommand: {
		register: true,
		idHints: ['974699589993111612']
	},
	aliases: ['botstatus', 'status']
})
export class UserCommand extends NinoCommand {
	readonly #sapphireVersion = /-next\.[a-z0-9]+\.\d{1,}/i

	public override async chatInputRun(interaction: CommandInteraction) {
		const embed = await this.embed({ interaction })

		await interaction.reply({
			embeds: [embed],
			components: UserCommand.components
		})
	}

	public override async messageRun(message: Message) {
		const embed = await this.embed({ message })

		await reply(message, { embeds: [embed], components: UserCommand.components })
	}

	private async embed({ message, interaction }: { message?: Message; interaction?: CommandInteraction }) {
		const embed = new MessageEmbed()
			.setAuthor({
				name: message ? message.author.tag : interaction!.user.tag,
				iconURL: message ? message.author.displayAvatarURL({ dynamic: true }) : interaction!.user.displayAvatarURL({ dynamic: true })
			})
			.setDescription(await resolveKey(message ?? interaction!, LanguageKeys.Util.Stats.EmbedDescription))
			.addField(
				await resolveKey(message ?? interaction!, LanguageKeys.Util.Stats.FieldDevs),
				`> - **Sebazz**: ${Emojis.github} [GitHub](https://github.com/uSebazz) | ${Emojis.twitter} [Twitter](https://twitter.com/uSebazz)\n> - **Hyduez**: ${Emojis.github} [Github](https://github.com/hyduez) | ${Emojis.twitter} [Twitter](https://twitter.com/hyduez)`
			)
			.addField(
				await resolveKey(message ?? interaction!, LanguageKeys.Util.Stats.FieldStatics),
				await resolveKey(message ?? interaction!, LanguageKeys.Util.Stats.FieldStaticsContent, {
					channels: this.botStatics.channels,
					guilds: this.botStatics.guilds,
					users: this.botStatics.users,
					commands: this.botStatics.commands,
					version: this.botStatics.version,
					sapphireVersion: this.botStatics.sapphireVersion
				})
			)
			.addField(
				await resolveKey(message ?? interaction!, LanguageKeys.Util.Stats.FieldSystem),
				await resolveKey(message ?? interaction!, LanguageKeys.Util.Stats.FieldSystemContent, {
					ramUsed: UserCommand.usageStatics.ramUsed,
					ramTotal: UserCommand.usageStatics.ramTotal,
					cpuLoad: UserCommand.usageStatics.cpuLoad,
					cpuModel: UserCommand.usageStatics.cpuModel
				})
			)
			.setColor(Colors.prettyPutunia)

		return embed
	}

	private static get components(): MessageActionRow[] {
		return [
			new MessageActionRow().addComponents(
				new MessageButton().setStyle('LINK').setLabel('Emojis').setURL('https://discord.gg/6YEypJXq'),
				new MessageButton().setStyle('LINK').setLabel('Support').setURL('https://dc.nino.fun')
			)
		]
	}

	private get botStatics(): StatsNino {
		return {
			users: this.container.client.guilds.cache.reduce((acc, val) => acc + val.memberCount, 0),
			guilds: this.container.client.guilds.cache.size,
			channels: this.container.client.channels.cache.size,
			commands: this.container.stores.get('commands').size,
			version: `v${discordVersion}`,
			sapphireVersion: `v${sapphireVersion.replace(this.#sapphireVersion, '')}`
		}
	}

	private static get usageStatics(): StatsUsage {
		const usage = process.memoryUsage()
		return {
			// eslint-disable-next-line
			cpuLoad: cpus().slice(0, 2).map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
			cpuModel: cpus()[0]!.model,
			ramTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
			ramUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`
		}
	}

	private static formatCpuInfo({ times }: CpuInfo) {
		return `${roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100}%`
	}
}

export interface StatsNino {
	channels: number
	users: number
	guilds: number
	commands: number
	version: string
	sapphireVersion: string
}
export interface StatsUsage {
	cpuLoad: string
	cpuModel: string
	ramTotal: string
	ramUsed: string
}
