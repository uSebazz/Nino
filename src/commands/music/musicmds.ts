import type { ApplicationCommandRegistry } from '@sapphire/framework'
import { Command } from '@sapphire/framework'
import { resolveKey } from '@sapphire/plugin-i18next'
import { NinoUtils } from '../../lib/utils'
import { SpotifyItemType } from '@lavaclient/spotify'
import { convertTime } from '../../lib/function/time'
import { MessageEmbed } from 'discord.js'
import type { CommandInteraction, GuildMember } from 'discord.js'
import type { MessageChannel } from '../../class/Client'

export class MusicCommands extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            preconditions: ['inVoiceChannel'],
        })
    }
    async chatInputRun(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember
        const utils = new NinoUtils()
        const { options } = interaction
        const { channel } = member.voice

        switch (options.getSubcommand()) {
        case 'play': {
            try {
                if (!channel.permissionsFor(interaction.guild.me).has('VIEW_CHANNEL')) {
                    return interaction.reply({
                        content: await resolveKey(interaction.channel, 'music:permissions.view', {
                            emote: utils.emojis.fail,
                            user: interaction.user.tag,
                        }),
                    })
                }

                if (!channel.permissionsFor(interaction.guild.me).has('CONNECT')) {
                    return interaction.reply({
                        content: await resolveKey(interaction.channel, 'music:permissions.connect', {
                            emote: utils.emojis.fail,
                            user: interaction.user.tag,
                        }),
                    })
                }

                if (!channel.permissionsFor(interaction.guild.me).has('SPEAK')) {
                    return interaction.reply({
                        content: await resolveKey(interaction.channel, 'music:permissions.speak', {
                            emote: utils.emojis.fail,
                            user: interaction.user.tag,
                        }),
                    })
                }

                const query = options.getString('track')
                let player = this.container.client.music.players.get(interaction.guild.id)
                let tracks = []

                if (player && player.channelId !== channel.id) {
                    return interaction.reply({
                        content: await resolveKey(interaction.channel, 'music:error.player', {
                            emote: utils.emojis.fail,
                            user: interaction.user.tag,
                        }),
                    })
                }

                if (this.container.client.music.spotify.isSpotifyUrl(query)) {
                    const item = await this.container.client.music.spotify.load(query)
                    if (!item) return

                    switch (item.type) {
                    case SpotifyItemType.Artist: {
                        tracks = await item.resolveYoutubeTracks()

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(
                                        await resolveKey(
                                            interaction.channel,
                                            'music:play.spotify.artist',
                                            {
                                                emote: utils.emojis.music,
                                                tracks: tracks.length,
                                                art: item.name,
                                                uri: query,
                                                requester: interaction.user.toString(),
                                                follow: item.data.followers.total,
                                                gen: item.data.genres[0],
                                            }
                                        )
                                    )
                                    .setThumbnail(item.data.images[1].url ?? item.data.images[0].url)
                                    .setColor('WHITE'),
                            ],
                        })
                        break
                    }
                    case SpotifyItemType.Playlist: {
                        tracks = await item.resolveYoutubeTracks()

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(
                                        await resolveKey(
                                            interaction.channel,
                                            'music:play.spotify.playlist',
                                            {
                                                emoji: utils.emojis.music,
                                                name: item.name,
                                                uri: query,
                                                tracks: tracks.length,
                                                desc: item.data.description ?? 'No',
                                                owner: item.data.owner.display_name,
                                            }
                                        )
                                    )
                                    .setThumbnail(item.data.images[1].url ?? item.data.images[0].url)
                                    .setColor('WHITE'),
                            ],
                        })
                        break
                    }

                    case SpotifyItemType.Track: {
                        const track = await item.resolveYoutubeTrack()
                        tracks = [track]

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(
                                        await resolveKey(
                                            interaction.channel,
                                            'music:play.spotify.track',
                                            {
                                                emote: utils.emojis.music,
                                                track: item.name,
                                                uri: query,
                                                requester: interaction.user.toString(),
                                                art: item.artists
                                                    .map((i) => i.name)
                                                    .slice(0, 5)
                                                    .join(', '),
                                                time: convertTime(item.data.duration_ms),
                                            }
                                        )
                                    )
                                    .setColor('WHITE'),
                            ],
                        })

                        break
                    }

                    case SpotifyItemType.Album: {
                        tracks = await item.resolveYoutubeTracks()

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(
                                        await resolveKey(
                                            interaction.channel,
                                            'music:play.spotify.album',
                                            {
                                                album: item.name,
                                                track: tracks.length,
                                                emoji: utils.emojis.music,
                                                desc: item.data.label ?? 'No',
                                                art: item.data.artists[0].name,
                                            }
                                        )
                                    )
                                    .setThumbnail(item.data.images[1].url ?? item.data.images[0].url)
                                    .setColor('WHITE'),
                            ],
                        })
                        break
                    }
                    default: {
                        await interaction.reply({
                            content: await resolveKey(interaction.channel, 'music:error.found'),
                        })
                        break
                    }
                    }
                } else {
                    const results = await this.container.client.music.rest.loadTracks(
                        /^https?:\/\//.test(query) ? query : `ytsearch:${query}`
                    )

                    switch (results.loadType) {
                    case 'LOAD_FAILED': {
                        await interaction.reply({
                            content: await resolveKey(interaction.channel, 'music:error.err', {
                                emoji: utils.emojis.ninozzz,
                            }),
                        })
                        break
                    }

                    case 'NO_MATCHES': {
                        await interaction.reply({
                            content: await resolveKey(interaction.channel, 'music:error.found'),
                        })
                        break
                    }

                    case 'PLAYLIST_LOADED': {
                        tracks = results.tracks
                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(
                                        await resolveKey(
                                            interaction.channel,
                                            'music:play.results.playlist',
                                            {
                                                emoji: utils.emojis.music,
                                                name: results.playlistInfo.name,
                                                uri: query,
                                                tracks: tracks.length,
                                            }
                                        )
                                    )
                                    .setColor('WHITE'),
                            ],
                        })
                        break
                    }

                    case 'SEARCH_RESULT': {
                        const [track] = results.tracks
                        tracks = [track]

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(
                                        await resolveKey(
                                            interaction.channel,
                                            'music:play.results.track',
                                            {
                                                emoji: utils.emojis.music,
                                                name: track.info.title,
                                                uri: track.info.uri,
                                                time: convertTime(track.info.length),
                                            }
                                        )
                                    )
                                    .setColor('WHITE'),
                            ],
                        })
                    }
                    }
                }

                if (!player) {
                    player = this.container.client.music.createPlayer(interaction.guildId)
                    player.queue.channel = interaction.channel as MessageChannel
                    await player.connect(channel.id, { deafened: true })
                }
                const started = player.playing || player.paused

                await player.queue.add(tracks, {
                    requester: interaction.user.id,
                })
                if (!started) {
                    await player.setVolume(50)
                    await player.queue.start()
                }
            } catch (err) {
                await interaction.reply({
                    content: await resolveKey(interaction.channel, 'music:error.catch', {
                        user: interaction.user.tag,
                        emoji: utils.emojis.fail,
                    }),
                })
            }
        }
        }
    }
    registerApplicationCommands(registery: ApplicationCommandRegistry) {
        registery.registerChatInputCommand(
            {
                name: 'music',
                description: 'SubCommands for a music',
                options: [
                    {
                        name: 'play',
                        description: 'play a music',
                        type: 'SUB_COMMAND',
                        options: [
                            {
                                name: 'track',
                                description: 'track to play',
                                type: 'STRING',
                                required: true,
                            },
                        ],
                    },
                ],
            },
            {
                guildIds: ['951101886684082176'],
                idHints: ['948394148334018652'],
            }
        )
    }
}
