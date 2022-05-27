/* eslint-disable no-unused-vars */
import '@sapphire/plugin-logger/register'
import '@sapphire/plugin-i18next/register'
import '@sapphire/plugin-editable-commands/register'

// declare things
import { registerFont } from 'canvas'
import type { ArrayString } from '@skyra/env-utilities'
import type { PrismaClient } from '@prisma/client'

registerFont(`${process.cwd()}/src/lib/fonts/Helvetica-Bold.ttf`, {
	family: 'Helvetica Bold'
})
registerFont(`${process.cwd()}/src/lib/assets/fonts/Helvetica.ttf`, {
	family: 'Helvetica Normal'
})

declare module '@sapphire/framework' {
	interface Preconditions {
		DevOnly: never
		Administrator: never
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
		CLIENT_OWNERS: ArrayString
	}
}
