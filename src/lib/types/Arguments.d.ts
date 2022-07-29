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
		color: string
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
