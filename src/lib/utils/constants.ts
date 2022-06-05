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

/*export const Badges = {
	EARLY_VERIFIED_BOT_DEVELOPER: '<:Discord_Bot_Developer:980632901328732210>',
	NITRO: '<:nitro:982444209288142859>',
	DISCORD_CERTIFIED_MODERATOR: '<:Discod_Certified_Moderator:980633106811846666>',
	PARTNERED_SERVER_OWNER: '<:partner:980633289234722887>',
	BUGHUNTER_LEVEL_1: '<:bughunter1:980641929433854012> ',
	BUGHUNTER_LEVEL_2: '<:bughunter2:980642054386360362>',
	DISCORD_EMPLOYEE: '<:discord_employee:980642330476433408>',
	HYPESQUAD_EVENTS: '<:hypesquadevents:980642539436650496>',
	EARLY_SUPPORTER: '<:earlysupporter:980642764607860777>',
	VERIFIED_BOT: '<:Verified_Bot:980608177542422538>',
	OWNER: '<:owner:980643113322287124>',
}*/

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
