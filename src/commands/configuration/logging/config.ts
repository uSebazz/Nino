import { LanguageKeys } from '#lib/i18n';
import { NinoCommand } from '#lib/structures';
import { RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced';
import { send } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import { ChannelType } from 'discord-api-types/v10';
import type { CommandInteraction, GuildBasedChannel, Message } from 'discord.js';

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder
		.setName('config')
		.setDescription('🔧 Configure the logging system for this guild')
		.addChannelOption((option) =>
			option //
				.setName('channel')
				.setDescription('🌐 The channel to log to')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		)
)
export class UserCommand extends NinoCommand {
	public override chatInputRun(interaction: NinoCommand.Interaction<'cached'>) {
		const channel = interaction.options.getChannel('channel') as GuildBasedChannel;

		return this.storageData(interaction, channel);
	}

	public override async messageRun(message: Message) {
		return send(message, await resolveKey(message, LanguageKeys.Config.Logging.OnlySlashCommand));
	}

	private async storageData(interaction: CommandInteraction<'cached'>, channel: GuildBasedChannel) {
		if (channel.type !== 'GUILD_TEXT') {
			this.error(LanguageKeys.Config.Logging.ChannelInvalid, {
				silent: true
			});
		}

		const guildId = BigInt(interaction.guildId);
		const data = await this.container.prisma.logChannel.findUnique({
			where: {
				guildId_channelId: {
					guildId,
					channelId: BigInt(channel.id)
				}
			}
		});

		if (data) {
			this.error(LanguageKeys.Config.Logging.ChannelInUse);
		}

		await this.container.prisma.logChannel.upsert({
			where: {
				guildId_channelId: {
					guildId,
					channelId: BigInt(channel.id)
				}
			},
			create: {
				guildId,
				channelId: BigInt(channel.id),
				events: []
			},
			update: {
				events: [],
				channelId: BigInt(channel.id),
				guild: {
					connectOrCreate: {
						where: {
							id: guildId
						},
						create: {
							id: guildId
						}
					}
				}
			}
		});

		return interaction.reply(
			await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelSet, {
				channel: `<#${channel.id}>`
			})
		);
	}
}
