import { NinoCommand } from '../../class/command'
import { version as sapphireVersion } from '@sapphire/framework'
import {
	version as discordVersion,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
} from 'discord.js'
import { seconds } from '../../lib/function/times'
import { time, TimestampStyles } from '@discordjs/builders'
import { ApplyOptions } from '@sapphire/decorators'
import { roundNumber } from '@sapphire/utilities'
import { resolveKey } from '@sapphire/plugin-i18next'
import { cpus, uptime, type CpuInfo } from 'node:os'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message } from 'discord.js'

@ApplyOptions<NinoCommand.Options>({
	description: 'shows nino statics',
	chatInputCommand: {
		register: true,
		guildIds: ['951101886684082176'],
	},
	aliases: ['botstatus', 'status'],
})
export class botStats extends NinoCommand {
	readonly #sapphireVersion = /-next\.[a-z0-9]+\.\d{1,}/i

	public override async chatInputRun(interaction: NinoCommand.Int) {
		const title = {
			stats: await resolveKey(interaction, 'util:stats.titles.stats'),
			uptime: await resolveKey(interaction, 'util:stats.titles.uptime'),
			usage: await resolveKey(interaction, 'util:stats.titles.usage'),
		}
		const buttons = {
			invite: await resolveKey(interaction, 'util:buttons.invite'),
		}

		const stats = this.botStatics
		const uptime = this.uptimeStatics
		const usage = this.usageStatics

		const embed = new MessageEmbed() //
			.addField(
				title.stats,
				await resolveKey(interaction, 'util:stats.stats', {
					channels: stats.channels,
					guilds: stats.guilds,
					users: stats.users,
					commands: stats.commands,
					version: stats.version,
					sapphireVersion: stats.sapphireVersion,
				})
			)
			.addField(
				title.uptime,
				await resolveKey(interaction, 'util:stats.uptime', {
					client: uptime.client,
					host: uptime.host,
					total: uptime.total,
				})
			)
			.addField(
				title.usage,
				await resolveKey(interaction, 'util:stats.usage', {
					cpuload: usage.cpuLoad,
					ramused: usage.ramUsed,
					ramtotal: usage.ramTotal,
				})
			)
			.setColor('WHITE')

		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setLabel(buttons.invite)
				.setStyle('LINK')
				.setURL('https://inv.nino.fun'),
		])
		await interaction.reply({ embeds: [embed], components: [row] })
	}

	public override async messageRun(message: Message) {
		const title = {
			stats: await resolveKey(message, 'util:stats.titles.stats'),
			uptime: await resolveKey(message, 'util:stats.titles.uptime'),
			usage: await resolveKey(message, 'util:stats.titles.usage'),
		}

		const stats = this.botStatics
		const uptime = this.uptimeStatics
		const usage = this.usageStatics

		const embed = new MessageEmbed() //
			.addField(
				title.stats,
				await resolveKey(message, 'util:stats.stats', {
					channels: stats.channels,
					guilds: stats.guilds,
					users: stats.users,
					commands: stats.commands,
					version: stats.version,
					sapphireVersion: stats.sapphireVersion,
				})
			)
			.addField(
				title.uptime,
				await resolveKey(message, 'util:stats.uptime', {
					client: uptime.client,
					host: uptime.host,
					total: uptime.total,
				})
			)
			.addField(
				title.usage,
				await resolveKey(message, 'util:stats.usage', {
					cpuload: usage.cpuLoad,
					ramused: usage.ramUsed,
					ramtotal: usage.ramTotal,
				})
			)

			.setColor('WHITE')

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
