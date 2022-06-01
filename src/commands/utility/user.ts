/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
	NinoCommand,
	type NinoCommandOptions,
	type NinoCommandRegistery,
} from '#lib/structures/NinoCommand'
import { Colors, Badges, Emojis } from '#utils/constans'
import { ApplyOptions } from '@sapphire/decorators'
import { resolveKey } from '@sapphire/plugin-i18next'
import { send } from '@sapphire/plugin-editable-commands'
import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch'
import { ApplicationFlags } from 'discord-api-types/v10'
import { MessageEmbed, Permissions } from 'discord.js'
import { RegisterBehavior, type Args } from '@sapphire/framework'
import type {
	Message,
	CommandInteraction,
	User,
	Guild,
	Snowflake,
	UserFlagsString,
	GuildMember,
	PermissionString,
} from 'discord.js'

/*const isValidURL = (url: string) => {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}*/

@ApplyOptions<NinoCommandOptions>({
	description: 'view user information',
	aliases: ['ui', 'user', 'info-user', 'whois'],
})
export class UserCommand extends NinoCommand {
	public readonly keyAdminPermission = Permissions.FLAGS.ADMINISTRATOR
	public readonly keyPermissions: Array<[PermissionString, bigint]> = [
		['BAN_MEMBERS', Permissions.FLAGS.BAN_MEMBERS],
		['KICK_MEMBERS', Permissions.FLAGS.KICK_MEMBERS],
		['CHANGE_NICKNAME', Permissions.FLAGS.CHANGE_NICKNAME],
		['MANAGE_CHANNELS', Permissions.FLAGS.MANAGE_CHANNELS],
		['MANAGE_GUILD', Permissions.FLAGS.MANAGE_GUILD],
		['MANAGE_MESSAGES', Permissions.FLAGS.MANAGE_MESSAGES],
		['MANAGE_NICKNAMES', Permissions.FLAGS.MANAGE_NICKNAMES],
		['MANAGE_ROLES', Permissions.FLAGS.MANAGE_ROLES],
		['MANAGE_WEBHOOKS', Permissions.FLAGS.MANAGE_WEBHOOKS],
		['MENTION_EVERYONE', Permissions.FLAGS.MENTION_EVERYONE],
		['VIEW_AUDIT_LOG', Permissions.FLAGS.VIEW_AUDIT_LOG],
		['VIEW_GUILD_INSIGHTS', Permissions.FLAGS.VIEW_GUILD_INSIGHTS],
		['MANAGE_THREADS', Permissions.FLAGS.MANAGE_THREADS],
		['MODERATE_MEMBERS', Permissions.FLAGS.MODERATE_MEMBERS],
		[
			'MANAGE_EMOJIS_AND_STICKERS',
			Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
		],
	]

	public override registerApplicationCommands(
		registery: NinoCommandRegistery
	) {
		registery.registerChatInputCommand(
			(builder) =>
				builder
					//
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) =>
						option
							//
							.setName('user')
							.setDescription(
								'the user to view information about'
							)
							.setRequired(false)
					),
			{
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			}
		)
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser('user') ?? interaction.user
		const member = await interaction
			.guild!.members.fetch(user.id)
			.catch(() => null)

		const embed = member
			? await this.memberEmbed(member, { interaction })
			: await this.userEmbed(user, { interaction })

		await interaction.reply({ embeds: [embed] })
	}

	public override async messageRun(message: Message, args: Args) {
		const user = args.finished
			? message.author
			: await args.pick('resolveUser')
		const member = await message
			.guild!.members.fetch(user.id)
			.catch(() => null)

		const embed = member
			? await this.memberEmbed(member, { message })
			: await this.userEmbed(user, { message })

		return send(message, { embeds: [embed] })
	}

	private async memberEmbed(
		member: GuildMember,
		{
			interaction,
			message,
		}: { interaction?: CommandInteraction; message?: Message }
	) {
		let application
		const permissions: string[] = []
		const badges = this.getBadges(
			member.user,
			message?.guild ?? interaction!.guild!
		)
		const roles = member.roles.cache
			.sorted((a, b) => a.position - b.position)
			.map((role) => role.toString())
			.join(' ')
			.replace('@everyone', '')

		if (member.user.bot) {
			application = await this.fetchBot(member.user.id).catch(() => null)
		}

		const embed = new MessageEmbed()
			.setColor(Colors.prettyPutunia)
			.setAuthor({
				name: member.user.tag,
				iconURL: member.user.displayAvatarURL({ dynamic: true }),
			})

		if (badges.length) {
			embed.setDescription(
				application
					? `${badges.join('  ')}\n\n${application.description}`
					: badges.join('  ')
			)
		} else if (member.user.bot) {
			embed.setDescription(`${application?.description as string}`)
		}

		embed.addField(
			await resolveKey(
				message ?? interaction!,
				'commands/util:user.field_about'
			),
			await resolveKey(
				message ?? interaction!,
				'commands/util:user.field_about_content_member',
				{
					createdAt: (member.user.createdTimestamp / 1000) | 0,
					joinedAt: (member.joinedTimestamp! / 1000) | 0,
					nickname: member.nickname ?? '-',
				}
			)
		)

		if (application) {
			const appInfo: string[] = []

			if (application.bot_public) {
				const botPublicKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.bot_public',
					{
						emoji: Emojis.check,
					}
				)

				appInfo.push(botPublicKey)
			} else {
				const noBotPublicKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.bot_public',
					{
						emoji: Emojis.fail,
					}
				)
				appInfo.push(noBotPublicKey)
			}

			if (
				(application.flags & ApplicationFlags.GatewayGuildMembers) ===
					ApplicationFlags.GatewayGuildMembers ||
				(application.flags &
					ApplicationFlags.GatewayGuildMembersLimited) ===
					ApplicationFlags.GatewayGuildMembersLimited
			) {
				const guildMembersKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.guild_members',
					{
						emoji:
							application.flags &
							ApplicationFlags.GatewayGuildMembers
								? Emojis.check
								: Emojis.pending,
					}
				)

				appInfo.push(guildMembersKey)
			}

			if (
				(application.flags & ApplicationFlags.GatewayPresence) ===
					ApplicationFlags.GatewayPresence ||
				(application.flags &
					ApplicationFlags.GatewayPresenceLimited) ===
					ApplicationFlags.GatewayPresenceLimited
			) {
				const gatewayPresenceKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_presence',
					{
						emoji:
							application.flags & ApplicationFlags.GatewayPresence
								? Emojis.check
								: Emojis.pending,
					}
				)
				appInfo.push(gatewayPresenceKey)
			} else {
				const noGatewayPresenceKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_presence',
					{
						emoji: Emojis.fail,
					}
				)
				appInfo.push(noGatewayPresenceKey)
			}

			if (
				(application.flags &
					NewApplicationFlags.GatewayMessageContent) ===
					NewApplicationFlags.GatewayMessageContent ||
				(application.flags &
					NewApplicationFlags.GatewayMessageContentLimited) ===
					NewApplicationFlags.GatewayMessageContentLimited
			) {
				const gatewayMessageContentKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_message_content',
					{
						emoji:
							application.flags &
							NewApplicationFlags.GatewayMessageContent
								? Emojis.check
								: Emojis.pending,
					}
				)

				appInfo.push(gatewayMessageContentKey)
			} else {
				const noGatewayMessageContentKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_message_content',
					{
						emoji: Emojis.fail,
					}
				)
				appInfo.push(noGatewayMessageContentKey)
			}

			embed.addField('» Bot', appInfo.join('\n'))
		}

		if (roles.length) {
			embed.addField(
				await resolveKey(
					message ?? interaction!,
					'commands/util:user.field_roles'
				),
				`> ${roles}`
			)
		}

		if (member.permissions.has(this.keyAdminPermission)) {
			embed.addField(
				await resolveKey(
					message ?? interaction!,
					'commands/util:user.field_permissions'
				),
				await resolveKey(
					message ?? interaction!,
					'commands/util:user.field_permissions_all'
				)
			)
		} else {
			for (const [name, value] of this.keyPermissions) {
				const key = await resolveKey(
					message ?? interaction!,
					`permissions:${name}`
				)

				if (member.permissions.has(value)) permissions.push(key)
			}

			if (permissions.length) {
				embed.addField(
					await resolveKey(
						message ?? interaction!,
						'commands/util:user.field_permissions'
					),
					`> ${permissions.join(', ')}`
				)
			}
		}

		embed.setFooter({ text: member.user.id })
		return embed
	}

	private async userEmbed(
		user: User,
		{
			interaction,
			message,
		}: {
			interaction?: CommandInteraction
			message?: Message
		}
	) {
		let application
		const badges = this.getBadges(
			user,
			message?.guild ?? interaction!.guild!
		)

		if (user.bot) {
			application = await this.fetchBot(user.id).catch(() => null)
		}

		const embed = new MessageEmbed()
			.setColor(Colors.pastelGreen)
			.setAuthor({
				name: user.tag,
				iconURL: user.displayAvatarURL({ dynamic: true }),
			})

		if (badges.length) {
			embed.setDescription(
				application
					? `${badges.join('  ')}\n\n${application.description}`
					: badges.join('  ')
			)
		} else if (user.bot) {
			embed.setDescription(`${application?.description as string}`)
		}

		embed.addField(
			await resolveKey(
				message ?? interaction!,
				'commands/util:user.field_about'
			),
			await resolveKey(
				message ?? interaction!,
				'commands/util:user.field_about_content_user',
				{
					createdAt: (user.createdTimestamp / 1000) | 0,
				}
			)
		)

		if (application) {
			const appInfo: string[] = []

			if (application.bot_public) {
				const botPublicKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.bot_public',
					{
						emoji: Emojis.check,
					}
				)

				appInfo.push(botPublicKey)
			} else {
				const noBotPublicKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.bot_public',
					{
						emoji: Emojis.fail,
					}
				)
				appInfo.push(noBotPublicKey)
			}

			if (
				(application.flags & ApplicationFlags.GatewayGuildMembers) ===
					ApplicationFlags.GatewayGuildMembers ||
				(application.flags &
					ApplicationFlags.GatewayGuildMembersLimited) ===
					ApplicationFlags.GatewayGuildMembersLimited
			) {
				const guildMembersKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.guild_members',
					{
						emoji:
							application.flags &
							ApplicationFlags.GatewayGuildMembers
								? Emojis.check
								: Emojis.emergency,
					}
				)

				appInfo.push(guildMembersKey)
			}

			if (
				(application.flags & ApplicationFlags.GatewayPresence) ===
					ApplicationFlags.GatewayPresence ||
				(application.flags &
					ApplicationFlags.GatewayPresenceLimited) ===
					ApplicationFlags.GatewayPresenceLimited
			) {
				const gatewayPresenceKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_presence',
					{
						emoji:
							application.flags & ApplicationFlags.GatewayPresence
								? Emojis.check
								: Emojis.pending,
					}
				)
				appInfo.push(gatewayPresenceKey)
			} else {
				const noGatewayPresenceKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_presence',
					{
						emoji: Emojis.fail,
					}
				)
				appInfo.push(noGatewayPresenceKey)
			}

			if (
				(application.flags &
					NewApplicationFlags.GatewayMessageContent) ===
					NewApplicationFlags.GatewayMessageContent ||
				(application.flags &
					NewApplicationFlags.GatewayMessageContentLimited) ===
					NewApplicationFlags.GatewayMessageContentLimited
			) {
				const gatewayMessageContentKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_message_content',
					{
						emoji:
							application.flags &
							NewApplicationFlags.GatewayMessageContent
								? Emojis.check
								: Emojis.emergency,
					}
				)

				appInfo.push(gatewayMessageContentKey)
			} else {
				const noGatewayMessageContentKey = await resolveKey(
					message ?? interaction!,
					'commands/util:user.gateway_message_content',
					{
						emoji: Emojis.fail,
					}
				)
				appInfo.push(noGatewayMessageContentKey)
			}

			embed.addField('» Bot', appInfo.join('\n'))
		}

		embed.setFooter({ text: user.id })

		return embed
	}

	private getBadges(user: User, guild?: Guild) {
		const flags = user.flags?.toArray() || []
		const emojis = []
		if (guild && guild.ownerId === user.id) emojis.push(Badges.OWNER)
		emojis.push(
			...Object.keys(Badges)
				.filter((badge) => flags.includes(badge as UserFlagsString))
				// @ts-expect-error - we know the type of the array
				.map((badge) => Badges[badge])
		)
		if (user.id === '159985870458322944') emojis.push(Badges.FUCK_MEE6)

		return emojis
	}

	private async fetchBot(bot: Snowflake) {
		const { name, id, description, bot_public, flags } =
			await fetch<FetchResponse>(
				`https://discord.com/api/v10/applications/${bot}/rpc`,
				{
					method: FetchMethods.Get,
				},
				FetchResultTypes.JSON
			)

		return {
			name,
			id,
			description,
			bot_public,
			flags,
		}
	}
}

interface FetchResponse {
	name: string
	id: string
	description: string
	bot_public: boolean
	flags: number
}

// !TODO: Remove this when the discord-api-types is updated
enum NewApplicationFlags {
	GatewayMessageContent = 262144,
	GatewayMessageContentLimited = 524288,
}
