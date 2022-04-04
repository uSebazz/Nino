import { NinoCommand } from '../../class/command'
import { version as sapphireVersion } from '@sapphire/framework'
import { version as discordVersion } from 'discord.js'
import { seconds } from '../../lib/function/times'
import { time, TimestampStyles } from '@discordjs/builders'
import { ApplyOptions } from '@sapphire/decorators'
import { roundNumber } from '@sapphire/utilities'
import { cpus, uptime, type CpuInfo } from 'node:os'
import type { Message, MessageEmbed } from 'discord.js'

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
		await interaction.reply('wait..')
	}

	public override async messageRun(message: Message) {
		await message.channel.send('wait..')
	}

	//private get embed(): MessageEmbed {
	//	const title = {}
	//}

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
