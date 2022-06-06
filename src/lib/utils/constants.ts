/* eslint-disable no-unused-vars */
import { getRootData } from '@sapphire/pieces'
import { join } from 'node:path'

export const mainFolder = getRootData().root
export const rootFolder = join(mainFolder, '..')

export enum Emojis {
	// Emojis for messages, sucess, error, etc.
	right = '<:eg_right:983109974970474587>',
	wrong = '<:eg_wrong:983110026363297832>',
	excl = '<:eg_excl:983109713979928716>',
	netual = '<:eg_netual:983110520628473978>',

	// Emojis for reactions and embeds
	ninozzz = '<a:NinoBuritoa:951482070583091240>',
	twitter = '<:twitter:977614632292343848>',
	github = '<:github:977614370722951168>',
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

	/*Two emojis for more resolution*/
	VERIFIED_BOT: '<:verifiedBot_1:983383644905283654><:verifiedBot_2:983383691264946216>',

	// No badges, but still a role or payment method
	NITRO: '<:Nitro:983148098358485032>',
	OWNER: '<:eg_crown:983384657469014076>', // thanks blink<3
}

export const gateways = {
	GATEWAY_PRESENCE: 1 << 12,
	GATEWAY_PRESENCE_LIMITED: 1 << 13,
	GATEWAY_GUILD_MEMBERS: 1 << 14,
	GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
	VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
	EMBEDDED: 1 << 17,
	GATEWAY_MESSAGE_CONTENT: 1 << 18,
	GATEWAY_MESSAGE_CONTENT_LIMITED: 1 << 19,
}

export enum Colors {
	pastelGreen = '#c7e9a8',
	prettyPutunia = '#ddb2e1',
}
