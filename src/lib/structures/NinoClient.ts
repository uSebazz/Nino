import { SapphireClient, container } from '@sapphire/framework'
import { envParseString } from '@skyra/env-utilities'
import { CLIENT_OPTIONS } from '#root/config'
import { connect, connection } from 'mongoose'

export class Nino extends SapphireClient {
	public constructor() {
		super(CLIENT_OPTIONS)
	}

	public async start() {
		await super.login(envParseString('DISCORD_TOKEN'))
	}

	public async database() {
		const url = envParseString('MONGO_URL')
		await connect(url).then(() => {
			container.logger.info(
				`Mongoose connection established successfully at ${connection.readyState}ms`
			)
		})
	}
}
