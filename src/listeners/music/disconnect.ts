import { container, Listener } from '@sapphire/framework'

export class disconnectListener extends Listener {
    constructor( context: Listener.Context, options: Listener.Options ) {
        super( context, {
            ...options,
            name: 'disconnect',
            emitter: container.client.music,
        } )
    }
    async run() {
        container.logger.debug( 'Lavalink node "NinoLink" disconnected.' )
    }
}
