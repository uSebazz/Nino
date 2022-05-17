import '@sapphire/plugin-logger/register'
import '@sapphire/plugin-i18next/register'
import '@sapphire/plugin-editable-commands/register'
import { SapphireClient } from '@sapphire/framework'
import { CLIENT_OPTIONS } from '#root/config'
import { NinoUtils } from '#utils/utils'
import { env } from '#utils/function/env'

export class Nino extends SapphireClient {
	public override utils: NinoUtils

	public constructor() {
		super(CLIENT_OPTIONS)

		this.utils = new NinoUtils()
	}

	public async start() {
		await super.login(env.DISCORD_TOKEN)
	}
}
