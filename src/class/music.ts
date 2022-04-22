import { Node as MusicClient } from 'lavaclient'
import { env } from '../lib/function/env'
import { load } from '@lavaclient/spotify'
import { container } from '@sapphire/framework'

load({
	client: {
		id: env.SPOTIFY_ID,
		secret: env.SPOTIFY_SECRET,
	},
	autoResolveYoutubeTracks: true,
})

export class NinoMusic extends MusicClient {
	public constructor() {
		const { client } = container
		super({
			sendGatewayPayload: (id, payload) => {
				client.guilds.cache.get(id)?.shard.send(payload)
			},
			connection: {
				host: env.LAVALINK_IP,
				password: env.LAVALINK_PASS,
				port: 25786,
				secure: false,
			},
		})
	}
}
