import { Listener, type Events } from '@sapphire/framework'
import type { Snowflake } from 'discord.js'

export class ShardReady extends Listener<typeof Events.ShardReady> {
	public override run(shardId: number, unavailableGuilds: Set<Snowflake>) {
		this.container.logger.info(`Shard [${shardId}] ready. (unaivalable guilds: ${unavailableGuilds.size})`)
	}
}
