import { load } from 'ts-dotenv'

export const env = load({
	DISCORD_TOKEN: String,
	LAVALINK_IP: String,
	LAVALINK_PASS: String,
	MONGO_URL: String,
	SPOTIFY_ID: String,
	SPOTIFY_SECRET: String,
})
