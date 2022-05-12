import '@sapphire/plugin-i18next/register'
import '@sapphire/plugin-editable-commands/register'
import {
	ApplicationCommandRegistries,
	container,
	RegisterBehavior,
	SapphireClient,
} from '@sapphire/framework'
import { connect, connection } from 'mongoose'
import { env } from '../lib/utils/function/env'
import { clientOptions } from '../config'
import { NinoUtils } from '../lib/utils/utils'
;(async () => {
	await connect(env.MONGO_URL).then(() => {
		container.logger.info(
			`Mongoose connection established successfully at ${connection.readyState}ms`
		)
	})
})().catch((e) => container.logger.error(e))

export class Nino extends SapphireClient {
	public override utils: NinoUtils
	public constructor() {
		super(clientOptions)
		this.utils = new NinoUtils()
	}

	public async start(): Promise<void> {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
			RegisterBehavior.Overwrite
		)

		await super.login(env.DISCORD_TOKEN)
	}
}

declare module '@sapphire/framework' {
	export interface SapphireClient {
		utils: NinoUtils
	}
	export interface Preconditions {
		inVoiceChannel: never
		ownerOnly: never
		channelSpeak: never
		channelJoin: never
		channelView: never
		channelFull: never
		Administrator: never
	}
}
