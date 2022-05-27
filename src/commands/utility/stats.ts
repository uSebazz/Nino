import { NinoCommand, type NinoCommandOptions } from '#lib/structures/NinoCommand'
import { testServer } from '#root/config'
import { Colors, Emojis } from '#utils/constans'
import { version as sapphireVersion } from '@sapphire/framework'
import { version as discordVersion, MessageEmbed, MessageActionRow, MessageButton, type CommandInteraction, type Message } from 'discord.js'
import { ApplyOptions } from '@sapphire/decorators'
import { roundNumber } from '@sapphire/utilities'
import { resolveKey } from '@sapphire/plugin-i18next'
import { cpus, type CpuInfo } from 'node:os'
import { reply } from '@sapphire/plugin-editable-commands'

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

@ApplyOptions<NinoCommandOptions>({
  description: 'shows nino statics',
  chatInputCommand: {
    register: true,
    guildIds: testServer,
    idHints: ['974699589993111612']
  },
  aliases: ['botstatus', 'status']
})

export class UserCommand extends NinoCommand {
  readonly #sapphireVersion = /-next\.[a-z0-9]+\.\d{1,}/i

  public override async chatInputRun(interaction: CommandInteraction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(await resolveKey(interaction, 'commands/util:stats.description'))
      .addField(
        await resolveKey(interaction, 'commands/util:stats.field_devs'),
        await resolveKey(interaction, 'commands/util:stats.field_devs_content', {
          twitter: Emojis.twitter,
          github: Emojis.github
        })
      )
      .addField(
        await resolveKey(interaction, 'commands/util:stats.field_statics'),
        await resolveKey(interaction, 'commands/util:stats.field_statics_content', {
          channels: this.botStatics.channels,
          guilds: this.botStatics.guilds,
          users: this.botStatics.users,
          commands: this.botStatics.commands,
          version: this.botStatics.version,
          sapphireVersion: this.botStatics.sapphireVersion
        })
      )
      .addField(
        await resolveKey(interaction, 'commands/util:stats.field_system'),
        await resolveKey(interaction, 'commands/util:stats.field_system_content', {
          ramUsed: this.usageStatics.ramUsed,
          ramTotal: this.usageStatics.ramTotal,
          cpuLoad: this.usageStatics.cpuLoad,
          cpuModel: this.usageStatics.cpuModel
        })
      )
      .setColor(Colors.prettyPutunia)

    await interaction.reply({ embeds: [embed], components: this.components })
  }

  public override async messageRun(message: Message) {
    const embed = new MessageEmbed()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setDescription(await resolveKey(message, 'commands/util:stats.description'))
      .addField(
        await resolveKey(message, 'commands/util:stats.field_devs'),
        await resolveKey(message, 'commands/util:stats.field_devs_content', {
          twitter: Emojis.twitter,
          github: Emojis.github
        })
      )
      .addField(
        await resolveKey(message, 'commands/util:stats.field_statics'),
        await resolveKey(message, 'commands/util:stats.field_statics_content', {
          channels: this.botStatics.channels,
          guilds: this.botStatics.guilds,
          users: this.botStatics.users,
          commands: this.botStatics.commands,
          version: this.botStatics.version,
          sapphireVersion: this.botStatics.sapphireVersion
        })
      )
      .addField(
        await resolveKey(message, 'commands/util:stats.field_system'),
        await resolveKey(message, 'commands/util:stats.field_system_content', {
          ramUsed: this.usageStatics.ramUsed,
          ramTotal: this.usageStatics.ramTotal,
          cpuLoad: this.usageStatics.cpuLoad,
          cpuModel: this.usageStatics.cpuModel
        })
      )
      .setColor(Colors.prettyPutunia)

    await reply(message, { embeds: [embed], components: this.components })
  }

  private get components(): MessageActionRow[] {
    return [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle('LINK')
          .setLabel('Emojis')
          .setURL('https://discord.gg/6YEypJXq'),
        new MessageButton()
          .setStyle('LINK')
          .setLabel('Support')
          .setURL('https://dc.nino.fun')
      )
    ]
  }

  private get botStatics(): StatsNino {
    return {
      users: this.container.client.guilds.cache.reduce(
        (acc, val) => acc + val.memberCount,
        0
      ),
      guilds: this.container.client.guilds.cache.size,
      channels: this.container.client.channels.cache.size,
      commands: this.container.stores.get('commands').size,
      version: `v${discordVersion}`,
      sapphireVersion: `v${sapphireVersion.replace(this.#sapphireVersion, '')}`
    }
  }

  private get usageStatics(): StatsUsage {
    const usage = process.memoryUsage()
    return {
      cpuLoad: cpus().slice(0, 2).map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
      cpuModel: cpus()[0]!.model,
      ramTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      ramUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`
    }
  }

  private static formatCpuInfo({ times }: CpuInfo) {
    return `${
      roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100
    }%`
  }
}
