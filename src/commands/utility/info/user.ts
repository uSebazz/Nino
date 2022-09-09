import { LanguageKeys } from '#lib/i18n';
import { Badges, Colors, Emojis, Gateways, isValidURL } from '#utils/constants';
import { Command, RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { resolveKey } from '@sapphire/plugin-i18next';
import {
	CommandInteraction,
	Guild,
	GuildMember,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Permissions,
	PermissionString,
	Snowflake,
	User,
	UserFlagsString
} from 'discord.js';

// Delete this when discord-api-types is updated to include this
enum NewApplicationsFlags {
	ApplicationCommands = 8388608
}

@RegisterSubCommand('info', (ctx) =>
	ctx //
		.setName('user')
		.setDescription('📍 Display information about a provided user.')
		.addUserOption((op) =>
			op //
				.setName('user')
				.setDescription('👤 The user to display information of')
				.setRequired(false)
		)
)
export class UserCommand extends Command {
	public readonly keyAdminPermission = Permissions.FLAGS.ADMINISTRATOR;
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
		['MANAGE_EMOJIS_AND_STICKERS', Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS]
	];

	public override async chatInputRun(ctx: CommandInteraction) {
		const user = ctx.options.getUser('user') ?? ctx.user;
		const member = await ctx.guild!.members.fetch(user.id).catch(() => null);
		const { bot } = user;

		if (bot) {
			return this.getBotInfo(user, ctx);
		} else if (member) {
			const embeds = await this.getMemberInfo(member, ctx);
			return ctx.reply({ embeds });
		}

		const embeds = await this.getUserInfo(user, ctx);
		return ctx.reply({ embeds });
	}

	private async getUserInfo(user: User, ctx: CommandInteraction) {
		const registration = `<t:${Math.round(user.createdTimestamp! / 1000)}:R>`;
		const embed = new MessageEmbed()
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setColor(Colors.prettyPutunia) // Rosado si no es un miembro
			.setDescription(this.getUserBadges(user, ctx.guild!).join(' '))
			.addFields([
				{
					name: await resolveKey(ctx.guild!, LanguageKeys.Util.User.About),
					value: await resolveKey(ctx.guild!, LanguageKeys.Util.User.AboutValue, {
						user,
						registration
					})
				}
			]);

		return [embed];
	}

	private async getBotInfo(user: User, ctx: CommandInteraction) {
		// @ts-expect-error No puedo obtener el tipo, porque no se cual es xd
		const info = (await (this.container.client.api as any).applications[user.id].rpc.get()) as BotResponse;
		const badges = this.getUserBadges(user).join(' ');
		const { flags } = info;
		const gatewaysFlags = this.getGatewaysFlags(flags);
		const components: MessageActionRow[] = [];
		components.push(new MessageActionRow());

		const embed = new MessageEmbed()
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setColor(Colors.overtone) // Verde si es un bot
			.addFields([
				{
					name: '» Flags',
					value: gatewaysFlags.join('\n')
				}
			]);

		if ((flags! & NewApplicationsFlags.ApplicationCommands) === NewApplicationsFlags.ApplicationCommands) {
			embed.setDescription(info.description ? `${Emojis.slashBot} ${badges}\n${info.description}` : `${badges} ${Emojis.slashBot}`);
		} else {
			embed.setDescription(info.description ? `${badges}\n${info.description}` : `${badges}`);
		}

		if (info.privacy_policy_url && isValidURL(info.privacy_policy_url)) {
			components[0]!.addComponents([new MessageButton().setStyle('LINK').setLabel('Privacy Policy').setURL(info.privacy_policy_url)]);
		}

		if (info.terms_of_service_url && isValidURL(info.terms_of_service_url)) {
			components[0]!.addComponents([new MessageButton().setStyle('LINK').setLabel('Terms of Service').setURL(info.terms_of_service_url)]);
		}

		if (components.every((row) => !row.components.length)) while (components.length) components.pop();

		return ctx.reply({ embeds: [embed], components });
	}

	private async getMemberInfo(member: GuildMember, ctx: CommandInteraction) {
		const joined = `<t:${Math.round(member.joinedTimestamp! / 1000)}:R>`;
		const registration = `<t:${Math.round(member.user.createdTimestamp! / 1000)}:R>`;
		const nickname = member.nickname ?? 'None';
		const memberIsBooster = member.premiumSince ? `Yes (<t:${Math.round(member.premiumSinceTimestamp! / 1000)}:R>)` : 'No';
		const roles = member.roles.cache
			.sorted((a, b) => a.position - b.position)
			.map((role) => role.toString())
			.join(' ')
			.replace('@everyone', '');

		const embed = new MessageEmbed()
			.setAuthor({
				name: member.user.tag,
				iconURL: member.user.displayAvatarURL()
			})
			.setColor(Colors.tanagerTurquoise) // Azul si es un miembro
			.setDescription(this.getUserBadges(member.user, ctx.guild!).join(' '))
			.addFields([
				{
					name: await resolveKey(ctx.guild!, LanguageKeys.Util.User.About),
					value: await resolveKey(ctx.guild!, LanguageKeys.Util.User.AboutValue, {
						user: member.user,
						registration
					})
				},
				{
					name: await resolveKey(ctx.guild!, LanguageKeys.Util.User.GuildMember),
					value: await resolveKey(ctx.guild!, LanguageKeys.Util.User.GuildMemberValue, {
						joined,
						nickname,
						memberIsBooster
					})
				},
				{
					name: await resolveKey(ctx.guild!, LanguageKeys.Util.User.Roles),
					value: `> ${roles}`
				},
				{
					name: await resolveKey(ctx.guild!, LanguageKeys.Util.User.Permissions),
					value: await this.getPermissions(member)
				}
			]);

		return [embed];
	}

	private async getPermissions(member: GuildMember) {
		const permissions: Array<string> = [];

		if (member.permissions.has(this.keyAdminPermission)) {
			const content = await resolveKey(member.guild!, LanguageKeys.Util.User.PermissionsAll);
			permissions.push(content);
		} else {
			for (const [name, value] of this.keyPermissions) {
				const key = await resolveKey(member.guild, `permissions:${name}`);

				if (member.permissions.has(value)) permissions.push(key);
			}
		}

		return permissions.join(', ');
	}

	private getUserBadges(user: User, guild?: Guild) {
		const userFlags = user.flags?.toArray() || [];
		const emojis: string[] = [];
		if (user.avatar?.startsWith('_a') && user.banner?.length) emojis.push(Badges.NITRO);
		if (guild && guild.ownerId === user.id) emojis.push(Badges.OWNER);
		emojis.push(
			...Object.keys(Badges)
				.filter((badge) => userFlags.includes(badge as UserFlagsString))
				.map((badge) => Badges[badge as keyof typeof Badges])
		);
		return emojis;
	}

	private getGatewaysFlags(flags: number) {
		const gatewaysFlags: Array<string> = [];

		if (
			(flags & Gateways.GATEWAY_MESSAGE_CONTENT) === Gateways.GATEWAY_MESSAGE_CONTENT ||
			(flags & Gateways.GATEWAY_MESSAGE_CONTENT_LIMITED) === Gateways.GATEWAY_MESSAGE_CONTENT_LIMITED
		) {
			gatewaysFlags.push(
				flags & Gateways.GATEWAY_MESSAGE_CONTENT
					? `> **Gateway Message Content**: ${Emojis.right}`
					: `> **Gateway Message Content**: ${Emojis.netual}`
			);
		} else {
			gatewaysFlags.push(`> **Gateway Message Content**: ${Emojis.wrong}`);
		}

		if (
			(flags & Gateways.GATEWAY_GUILD_MEMBERS) === Gateways.GATEWAY_GUILD_MEMBERS ||
			(flags & Gateways.GATEWAY_GUILD_MEMBERS_LIMITED) === Gateways.GATEWAY_GUILD_MEMBERS_LIMITED
		) {
			gatewaysFlags.push(
				flags & Gateways.GATEWAY_GUILD_MEMBERS
					? `> **Gateway Guild Members**: ${Emojis.right}`
					: `> **Gateway Guild Members**: ${Emojis.netual}`
			);
		} else {
			gatewaysFlags.push(`> **Gateway Guild Members**: ${Emojis.wrong}`);
		}

		if (
			(flags & Gateways.GATEWAY_PRESENCE) === Gateways.GATEWAY_PRESENCE ||
			(flags & Gateways.GATEWAY_PRESENCE_LIMITED) === Gateways.GATEWAY_PRESENCE_LIMITED
		) {
			gatewaysFlags.push(
				flags & Gateways.GATEWAY_PRESENCE ? `> **Gateway Presence**: ${Emojis.right}` : `> **Gateway Presence**: ${Emojis.netual}`
			);
		} else {
			gatewaysFlags.push(`> **Gateway Presence**: ${Emojis.wrong}`);
		}

		return gatewaysFlags;
	}
}

interface BotResponse {
	id: Snowflake;
	name: string | null;
	icon: string | null;
	description: string | null;
	bot_public: boolean;
	terms_of_service_url: string | null;
	privacy_policy_url: string | null;
	flags: number;
}
