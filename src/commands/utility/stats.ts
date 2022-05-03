import { NinoCommand } from '../../class/command'
import { testServer } from '../../config'
import { version as sapphireVersion } from '@sapphire/framework'
import { version as discordVersion, MessageEmbed } from 'discord.js'
import { seconds } from '../../lib/utils/function/times'
import { time, TimestampStyles } from '@discordjs/builders'
import { ApplyOptions } from '@sapphire/decorators'
import { roundNumber } from '@sapphire/utilities'
import { resolveKey } from '@sapphire/plugin-i18next'
import { cpus, uptime, type CpuInfo } from 'node:os'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message, ColorResolvable } from 'discord.js'

@ApplyOptions<NinoCommand.Options>({
	description: 'shows nino statics',
	chatInputCommand: {
		register: true,
		guildIds: testServer,
	},
	aliases: ['botstatus', 'status'],
})
export class botStats extends NinoCommand {
	readonly #sapphireVersion = /-next\.[a-z0-9]+\.\d{1,}/i

	public override async chatInputRun(interaction: NinoCommand.Interaction) {
		const { colors } = this.container.client.utils
		const dev = await this.container.client.users.fetch('899339781132124220')

		const embed = new MessageEmbed()
			.setAuthor({
				name: 'Nino Stats',
				iconURL: this.container.client.user!.displayAvatarURL(),
				url: 'https://github.com/uSebazz/Nino',
			})
			.setDescription(await resolveKey(interaction, 'commands/util:stats.description'))
			.addField(
				await resolveKey(interaction, 'commands/util:stats.bot'),
				await resolveKey(interaction, 'commands/util:stats.first_field', {
					id: this.container.client.id,
					dev: `[${dev.tag}](https://discord.com/users/${dev.id})`,
					unix: (this.container.client.user!.createdTimestamp / 1000) | 0,
				})
			)
			.addField(
				await resolveKey(interaction, 'commands/util:stats.system'),
				await resolveKey(interaction, 'commands/util:stats.second_field', {
					cpuload: this.usageStatics.cpuLoad,
					ramtotal: this.usageStatics.ramTotal,
					ramused: this.usageStatics.ramUsed,
					client: this.uptimeStatics.client,
					host: this.uptimeStatics.host,
					total: this.uptimeStatics.total,
				}),
				true
			)
			.addField(
				await resolveKey(interaction, 'commands/util:stats.stats'),
				await resolveKey(interaction, 'commands/util:stats.third_field', {
					channels: this.botStatics.channels,
					guilds: this.botStatics.guilds,
					users: this.botStatics.users,
					commands: this.botStatics.commands,
					version: this.botStatics.version,
					sapphire: this.botStatics.sapphireVersion,
				})
			)
			.setColor(colors.green.pastel as ColorResolvable)

		await interaction.reply({ embeds: [embed] })
	}

	public override async messageRun(message: Message) {
		const { colors } = this.container.client.utils
		const dev = await this.container.client.users.fetch('899339781132124220')

		const embed = new MessageEmbed()
			.setAuthor({
				name: 'Nino Stats',
				iconURL: this.container.client.user!.displayAvatarURL(),
				url: 'https://github.com/uSebazz/Nino',
			})
			.setDescription(await resolveKey(message, 'commands/util:stats.description'))
			.addField(
				await resolveKey(message, 'commands/util:stats.bot'),
				await resolveKey(message, 'commands/util:stats.first_field', {
					id: this.container.client.id,
					dev: `[${dev.tag}](https://discord.com/users/${dev.id})`,
					unix: (this.container.client.user!.createdTimestamp / 1000) | 0,
				})
			)
			.addField(
				await resolveKey(message, 'commands/util:stats.system'),
				await resolveKey(message, 'commands/util:stats.second_field', {
					cpuload: this.usageStatics.cpuLoad,
					ramtotal: this.usageStatics.ramTotal,
					ramused: this.usageStatics.ramUsed,
					client: this.uptimeStatics.client,
					host: this.uptimeStatics.host,
					total: this.uptimeStatics.total,
				}),
				true
			)
			.addField(
				await resolveKey(message, 'commands/util:stats.stats'),
				await resolveKey(message, 'commands/util:stats.third_field', {
					channels: this.botStatics.channels,
					guilds: this.botStatics.guilds,
					users: this.botStatics.users,
					commands: this.botStatics.commands,
					version: this.botStatics.version,
					sapphire: this.botStatics.sapphireVersion,
				})
			)
			.setColor(colors.green.pastel as ColorResolvable)

		await send(message, { embeds: [embed] })
	}

	private get botStatics(): StatsNino {
		return {
			channels: this.container.client.channels.cache.size,
			guilds: this.container.client.guilds.cache.size,
			users: this.container.client.guilds.cache.reduce(
				(acc, val) => acc + val.memberCount,
				0
			),
			commands: this.container.stores.get('commands').size,
			version: `v${discordVersion}`,
			sapphireVersion: `v${sapphireVersion.replace(this.#sapphireVersion, '')}`,
		}
	}

	private get uptimeStatics(): StatsUptime {
		const now = Date.now()
		const nowSeconds = roundNumber(now / 1000)
		return {
			client: time(
				seconds.fromMilliseconds(now - this.container.client.uptime!),
				TimestampStyles.RelativeTime
			),
			host: time(roundNumber(nowSeconds - uptime()), TimestampStyles.RelativeTime),
			total: time(
				roundNumber(nowSeconds - process.uptime()),
				TimestampStyles.RelativeTime
			),
		}
	}

	private get usageStatics(): StatsUsage {
		const usage = process.memoryUsage()
		return {
			// eslint-disable-next-line newline-per-chained-call
			cpuLoad: cpus().slice(0, 2).map(botStats.formatCpuInfo.bind(null)).join(' | '),
			ramTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
			ramUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
		}
	}

	private static formatCpuInfo({ times }: CpuInfo) {
		return `${
			roundNumber(
				((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000
			) / 100
		}%`
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

export interface StatsUptime {
	client: string
	host: string
	total: string
}
export interface StatsUsage {
	cpuLoad: string
	ramTotal: string
	ramUsed: string
}
