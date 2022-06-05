/* eslint-disable no-unused-vars */
import '@sapphire/plugin-logger/register'
import '@sapphire/plugin-i18next/register'
import '@sapphire/plugin-editable-commands/register'

// declare things
import type { ArrayString } from '@skyra/env-utilities'
import type { PrismaClient } from '@prisma/client'
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
		CLIENT_OWNERS: ArrayString
	}
}
