/* eslint-disable no-unused-vars */
import '@kaname-png/plugin-statcord/register'
import '@sapphire/plugin-editable-commands/register'
import '@sapphire/plugin-i18next/register'
import '@sapphire/plugin-logger/register'

// declare things
import type { PrismaClient } from '@prisma/client'
import type { ArrayString } from '@skyra/env-utilities'
import type { User } from 'discord.js'

declare module '@sapphire/framework' {
	interface Preconditions {
		DevOnly: never
		Administrator: never
	}

	interface ArgType {
		resolveUser: User
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient
	}
}

declare module '@skyra/env-utilities' {
	interface Env {
		DISCORD_TOKEN: string
		WEBHOOK_TOKEN: string
		STATCORD_TOKEN: string
		CLIENT_ID: string
		CLIENT_OWNERS: ArrayString
	}
}
