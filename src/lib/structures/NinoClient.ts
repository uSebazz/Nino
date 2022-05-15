import { SapphireClient } from '@sapphire/framework'
import { CLIENT_OPTIONS } from '#root/config'
import { NinoUtils } from '#utils/utils'

export class Nino extends SapphireClient {
	public override utils: NinoUtils

	public constructor() {
		super(CLIENT_OPTIONS)

		this.utils = new NinoUtils()
	}

	public async start() {
		await super.login()
	}
}
