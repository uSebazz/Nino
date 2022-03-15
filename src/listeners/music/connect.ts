import { container, Listener } from '@sapphire/framework'

export class connectNodeListener extends Listener {
    constructor( context: Listener.Context, options: Listener.Options ) {
        super( context, {
            ...options,
            event: 'connect',
            emitter: container.client.music,
        } )
    }

    run() {
        container.logger.info( 'Lavalink node "NinoLink" connected' )
    }
}
