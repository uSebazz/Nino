import { Listener, type Events } from '@sapphire/framework'
import { cyan } from 'colorette'

export class ShardReady extends Listener<typeof Events.ShardReady> {
	public override run(shardId: number) {
		this.container.logger.info(`Shard [${cyan(shardId)}] ready.`)
	}
}
