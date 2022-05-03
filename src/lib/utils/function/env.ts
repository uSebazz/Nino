import { load } from 'ts-dotenv'

export const env = load({
	DISCORD_TOKEN: String,
	MONGO_URL: String,
	NODE_PROCESS: String,
})
