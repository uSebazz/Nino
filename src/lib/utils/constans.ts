/* eslint-disable no-unused-vars */
import { getRootData } from '@sapphire/pieces'
import { join } from 'node:path'

export const mainFolder = getRootData().root
export const rootFolder = join(mainFolder, '..')

export enum Emojis {
	check = '<:Check_Mark:924321938715856951>',
	fail = '<:Fail_Cross:924321864912875560>',
	emergency = '<:Emergency:925219674038341642>',
	pending = '<:pending:925219711430565949>',
	ninozzz = '<a:NinoBuritoa:951482070583091240>',
	twitter = '<:twitter:977614632292343848>',
	github = '<:github:977614370722951168>',
}

export enum Colors {
	pastelGreen = '#c7e9a8',
	prettyPutunia = '#ddb2e1',
}
