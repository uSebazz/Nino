import { LanguageKeys } from '#lib/i18n';
import { Command, RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced';
import { send } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { CommandInteraction, GuildBasedChannel, Message } from 'discord.js';

@RegisterSubCommandGroup('config', 'logging', (builder) =>
	builder //
		.setName('config')
		.setDescription('🔧 Configure the logging system for this guild')
		.addChannelOption((option) =>
			option //
				.setName('channel')
				.setDescription('🌐 The channel to log to')
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction<'cached'>) {
		const channel = interaction.options.getChannel('channel') as GuildBasedChannel;

		return this.storageData(interaction, channel);
	}

	public override async messageRun(message: Message) {
		return send(message, await resolveKey(message, LanguageKeys.Config.Logging.OnlySlashCommand));
	}

	private async storageData(interaction: CommandInteraction<'cached'>, channel: GuildBasedChannel) {
		if (channel.type !== 'GUILD_TEXT') {
			const content = await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelInvalid);
			return interaction.reply({
				content,
				ephemeral: true
			});
		}

		const guildId = BigInt(interaction.guildId);
		const data = await this.container.prisma.guild.findFirst({
			where: {
				id: guildId,
				logs: {
					some: {
						channelId: BigInt(channel.id)
					}
				}
			}
		});

		if (data) {
			return interaction.reply(
				await resolveKey(interaction, LanguageKeys.Config.Logging.ChannelInUse, {
					channel: `<#${channel.id}>`
				})
			);
		}

		await this.container.prisma.logChannel.upsert({
			where: {
				guildId
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
