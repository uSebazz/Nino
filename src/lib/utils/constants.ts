import { getRootData } from '@sapphire/pieces';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { join } from 'node:path';

export const mainFolder = getRootData().root;
export const rootFolder = join(mainFolder, '..');

export enum Emojis {
	// Emojis for messages, sucess, error, etc.
	right = '<:eg_right:983109974970474587>',
	wrong = '<:eg_wrong:983110026363297832>',
	excl = '<:eg_excl:983109713979928716>',
	netual = '<:eg_netual:983110520628473978>',
	setting = '<:eg_setting:983110764330123315>',

	// Emojis for reactions and embeds
	twitter = '<:eg_twitter:986081387188715530>',
	github = '<:github:977614370722951168>',
	slashBot = '<:commands_badge:999745813376942121>',
	user = '<:eg_user:1005916131065868398>',
	bot = '<:icons_bots:1005916230445694986>',

	// Channels
	guildText = '<:eg_channel:1005531859473661982>',
	guildVoice = '<:eg_voice:1005532383560339557>',
	guildStage = '<:eg_stage:1005909161051160698>',

	// Logs
	messageDelete = '<:eg_deletemessage:991672466621608027>',

	// Emojis for the bot
	ninoheart = '<:co_ninoheart:990370569876807771>',
	ninoburrito = '<a:NinoBuritoa:951482070583091240>',
	ninozzz = '<:co_ninozzz:990370751389503579>',
	ninouwu = '<:co_ninouwu:987914627033735178>',
	ninowlc = '<:co_ninowlc:990370791612887070>'
}

export const Badges = {
	HOUSE_BALANCE: '<:Balance:983148013746794496>',
	HOUSE_BRAVERY: '<:Bravery:983147879466139709>',
	HOUSE_BRILLIANCE: '<:Brillance:983147958298099782>',
	BUGHUNTER_LEVEL_1: '<:Bughunter_1:983149625697521775>',
	BUGHUNTER_LEVEL_2: '<:Bughunter_2:983149672417853500>',
	EARLY_VERIFIED_BOT_DEVELOPER: '<:Developer:983149046594158672>',
	HYPESQUAD_EVENTS: '<:Hypesquad:983148167556120636>',
	DISCORD_CERTIFIED_MODERATOR: '<:Moderator:983148231502483486>',
	PARTNERED_SERVER_OWNER: '<:Partner:983150335579287582>',
	DISCORD_EMPLOYEE: '<:Staff:983150210115043358>',
	EARLY_SUPPORTER: '<:Supporter:983148943632392264>',

	/* Two emojis for more resolution*/
	VERIFIED_BOT: '<:verifiedBot_1:983383644905283654><:verifiedBot_2:983383691264946216>',

	// No badges, but still a role or payment method
	NITRO: '<:Nitro:983148098358485032>',
	OWNER: '<:eg_crown:983384657469014076>', // thanks blink<3

	SERVER_VERIFIED: '<:eg_serververified:1006366008937828372>',
	SERVER_PARTNER: '<:eg_serverpartnered:1006366203599650978>'
};

export const Gateways = {
	GATEWAY_PRESENCE: 1 << 12,
	GATEWAY_PRESENCE_LIMITED: 1 << 13,
	GATEWAY_GUILD_MEMBERS: 1 << 14,
	GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
	VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
	EMBEDDED: 1 << 17,
	GATEWAY_MESSAGE_CONTENT: 1 << 18,
	GATEWAY_MESSAGE_CONTENT_LIMITED: 1 << 19
	/* APPLICATION_COMMAND_BADGE: 1 << 23 */ // its a flag, but not a gateway intent
};

export enum Colors {
	pastelGreen = '#c7e9a8',
	prettyPutunia = '#ddb2e1',
	tanagerTurquoise = '#92DCE5',
	whaleMouth = '#C8D3D5',
	hazyDaze = '#A4B8C4',
	pickFord = '#C7EFCF',
	overtone = '#A1E6B6',
	invisible = '#2F3136'
}

export const LoggingEvents: Array<APIApplicationCommandOptionChoice<string>> = [
	{
		name: 'All events',
		value: 'all'
	},
	{
		name: 'Message Delete',
		value: 'messageDelete'
	},
	{
		name: 'Message Bulk Delete',
		value: 'messageBulkDelete'
	},
	{
		name: 'Message Update',
		value: 'messageUpdate'
	},
	{
		name: 'Channel Create',
		value: 'channelCreate'
	},
	{
		name: 'Channel Delete',
		value: 'channelDelete'
	},
	{
		name: 'Channel Update',
		value: 'channelUpdate'
	},
	{
		name: 'Channel Pins Update',
		value: 'channelPinsUpdate'
	},
	{
		name: 'Guild Ban Add',
		value: 'guildBanAdd'
	},
	{
		name: 'Guild Ban Remove',
		value: 'guildBanRemove'
	},
	{
		name: 'Guild Emoji Create',
		value: 'guildEmojiCreate'
	},
	{
		name: 'Guild Emoji Remove',
		value: 'guildEmojiRemove'
	},
	{
		name: 'Guild Emoji Update',
		value: 'guildEmojiUpdate'
	},
	{
		name: 'Guild Member Add',
		value: 'guildMemberAdd'
	},
	{
		name: 'Guild Member Remove',
		value: 'guildMemberRemove'
	},
	{
		name: 'Guild Member Update',
		value: 'guildMemberUpdate'
	},
	{
		name: 'Guild Role Create',
		value: 'roleCreate'
	},
	{
		name: 'Guild Role Delete',
		value: 'roleDelete'
	},
	{
		name: 'Guild Role Update',
		value: 'roleUpdate'
	},
	{
		name: 'Guild Sticker Create',
		value: 'stickerCreate'
	},
	{
		name: 'Guild Sticker Delete',
		value: 'stickerDelete'
	},
	{
		name: 'Guild Sticker Update',
		value: 'stickerUpdate'
	},
	{
		name: 'Guild Update',
		value: 'guildUpdate'
	}
];

export const LoggingOptions: Array<APIApplicationCommandOptionChoice<string>> = [
	{
		name: 'Ignore Bots',
		value: 'ignoreBots'
	},
	{
		name: 'Ignore Staff',
		value: 'ignoreStaff'
	}
];

export const isValidURL = (str: string) => {
	try {
		new URL(str);
		return true;
	} catch (_) {
		return false;
	}
};
