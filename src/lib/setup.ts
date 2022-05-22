import '#utils/sanitizer/initClean'

// Import the plugins of Sapphire
import '@sapphire/plugin-logger/register'
import '@sapphire/plugin-i18next/register'
import '@sapphire/plugin-editable-commands/register'

// declare things
import type { ArrayString } from '@skyra/env-utilities'

declare module '@sapphire/framework' {
	export interface Preconditions {
		inVoiceChannel: never
		devOnly: never
		channelSpeak: never
		channelJoin: never
		channelView: never
		channelFull: never
		Administrator: never
	}
}

declare module '@skyra/env-utilities' {
	interface Env {
		DISCORD_TOKEN: string
		MONGO_URL: string
		CLIENT_OWNERS: ArrayString
	}
}
