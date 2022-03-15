import { container, Listener } from '@sapphire/framework'
import { convertTime } from '../../lib/function/time'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { resolveKey } from '@sapphire/plugin-i18next'
import type { Message } from 'discord.js'
import type { Queue } from '@lavaclient/queue'
import { NinoUtils } from '../../lib/utils'

export class trackStartListener extends Listener {
    constructor( context: Listener.Context, options: Listener.Options ) {
        super( context, {
            ...options,
            event: 'trackStart',
            emitter: container.client.music,
        } )
    }
    async run( queue: Queue, message: Message ) {
        const utils = new NinoUtils()
        const length2 = queue.current.length
        let trackLength = convertTime( length2 )
        const req = `<@${ queue.current.requester }>`
        const player = this.container.client.music.players.get( message.guildId )

        if ( !queue.current.isSeekable ) {
            trackLength = 'Live Stream'
        }

        const button1 = new MessageButton()
            .setStyle( 'SECONDARY' )
            .setCustomId( '1' )
            .setLabel( await resolveKey( queue.channel, 'music:events.buttons.track.1' ) )

        const button2 = new MessageButton()
            .setStyle( 'DANGER' )
            .setCustomId( '2' )
            .setLabel( await resolveKey( queue.channel, 'music:events.buttons.track.2' ) )

        const button3 = new MessageButton()
            .setStyle( 'PRIMARY' )
            .setCustomId( '3' )
            .setLabel( await resolveKey( queue.channel, 'music:events.buttons.track.3' ) )

        const button4 = new MessageButton()
            .setStyle( 'PRIMARY' )
            .setCustomId( '4' )
            .setLabel( await resolveKey( queue.channel, 'music:events.buttons.track.4' ) )

        const embed = new MessageEmbed()
            .setDescription(
                await resolveKey( queue.channel, 'music:events.track_start', {
                    emoji: utils.emojis.music,
                    track: queue.current.title,
                    uri: queue.current.uri,
                    requester: req,
                    time: trackLength,
                } )
            )
            .setColor( 'WHITE' )
            .setThumbnail( `https://img.youtube.com/vi/${ queue.current.identifier }/maxresdefault.jpg` )

        const msg = await queue.channel.send( {
            embeds: [ embed ],
            components: [ new MessageActionRow().addComponents( [ button1, button2, button3, button4 ] ) ],
        } )

        const filter = async int => {
            if (
                int.guild.me.voice.channel &&
				int.guild.me.voice.channelId === int.member.voice.channelId
            ) { return true } else {
                int.reply( {
                    content: await resolveKey( queue.channel, 'music:error.channel', {
                        emote: utils.emojis.ninozzz,
                        channel: int.guild.me.channelId,
                    } ),
                    ephemeral: true,
                } )

                return false
            }
        }

        const col = msg.createMessageComponentCollector( {
            filter: filter,
            time: queue.current.length,
        } )

        col.on( 'collect', async int => {
            switch ( await int.customId ) {
            case '1': {
                if ( player.queue.tracks.length === 0 || player.queue.tracks.length === 1 ) {
                    return int.reply( {
                        content: await resolveKey( queue.channel, 'music:events.player.notracks' ),
                        ephemeral: true,
                    } )
                } else {
                    player.queue.shuffle()
                    await int.reply( {
                        content: await resolveKey( queue.channel, 'music:events.' ),
                        ephemeral: true,
                    } )
                }
                break
            }

            case '2': {
                if ( player.queue.tracks.length === 0 || player.queue.tracks.length === 1 ) {
                    return int.reply( {
                        content: await resolveKey( queue.channel, 'music:events.player.notracks' ),
                        ephemeral: true,
                    } )
                } else {
                    player.disconnect()
                }
                break
            }

            case '3': {
                break
            }

            case '4': {
                break
            }
            }
        } )
    }
}
