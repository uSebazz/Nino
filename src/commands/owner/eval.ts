import type { ApplicationCommandRegistry } from '@sapphire/framework'
import { Command } from '@sapphire/framework'
import type { CommandInteraction } from 'discord.js'
import { Formatters } from 'discord.js'
import { inspect, promisify } from 'util'
import { exec } from 'child_process'

export class EvalCode extends Command {
    public constructor( context: Command.Context, options: Command.Options ) {
        super( context, {
            ...options,
            preconditions: [ 'OwnerOnly' ],
        } )
    }
    async chatInputRun( interaction: CommandInteraction ) {
        const { options } = interaction

        const code = options.getString( 'code', true )
        let evalued = undefined

        switch ( options.getString( 'type', true ) ) {
        case '1': {
            try {
                evalued = await eval( code )
                evalued = inspect( evalued, { depth: 0 } )
            } catch ( err ) {
                evalued = err.toString()
            }
            break
        }
        case '2': {
            try {
                evalued = await eval( `(async() => {\n${  code  }\n})();` )
                evalued = inspect( evalued, { depth: 0 } )
            } catch ( err ) {
                evalued = err.toString()
            }
            break
        }
        case '3': {
            try {
                const { stdout, stderr } = await promisify( exec )( code )
                if ( !stdout && !stderr ) {
                    console.log( 'Comando invalido (exec)' )
                }
                if ( stdout ) evalued = stdout
                if ( stderr ) evalued = stderr
            } catch ( err ) {
                evalued = err.toString()
            }
            break
        }
        }
        const mensaje = Formatters.codeBlock( 'js', evalued.slice( 0, 1950 ) )

        await interaction.reply( {
            content: mensaje,
        } )
    }
    registerApplicationCommands( registery: ApplicationCommandRegistry ) {
        registery.registerChatInputCommand(
            {
                name: 'eval',
                description: 'Evaluate a code',
                options: [
                    {
                        type: 'STRING',
                        required: true,
                        name: 'code',
                        description: 'Code to evaluate',
                    },
                    {
                        type: 'STRING',
                        required: true,
                        name: 'type',
                        description: 'Type of code evaluation',
                        choices: [
                            {
                                name: '-n',
                                value: '1',
                            },
                            {
                                name: '-a',
                                value: '2',
                            },
                            {
                                name: '-e',
                                value: '3',
                            },
                        ],
                    },
                ],
            },
            {
                guildIds: [ '951101886684082176' ],
                idHints: [ '950410114202992650' ],
            }
        )
    }
}
