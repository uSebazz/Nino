import { NinoCommand } from '../../class/command'
import { ApplyOptions } from '@sapphire/decorators'
import { SpotifyItemType } from '@lavaclient/spotify'
import type { MessageChannel } from '../../class/client'
import type { Addable } from '@lavaclient/queue'
import type { GuildMember, VoiceBasedChannel } from 'discord.js'
import { resolveKey } from '@sapphire/plugin-i18next'

@ApplyOptions<NinoCommand.Options>({
	description: 'play music from spotify or youtube',
	preconditions: ['inVoiceChannel', 'channelView', 'channelSpeak', 'channelJoin'],
})
export class PlayMusicCommand extends NinoCommand {
	readonly #choices: Array<[name: string, value: string]> = [
		['Youtube', 'youtube'],
		['YouTubeMusic', 'youtubemusic'],
		['Soundcloud', 'soundcloud'],
	]
	public override registerApplicationCommands(registry: NinoCommand.Registry): void {
		registry.registerChatInputCommand(
			(builder) =>
				builder //
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('query')
							.setDescription('the query to search for')
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName('type')
							.setDescription('the type of music to search for')
							.setChoices(this.#choices)
					),
			{
				guildIds: ['951101886684082176'],
			}
		)
	}
	public override chatInputRun(interaction: NinoCommand.Int) {
		const outPut = interaction.options.getString('type') ?? 'youtube'
		const song = interaction.options.getString('query') as string
		const member = interaction.member as GuildMember
		const channel = member.voice.channel as VoiceBasedChannel

		return this.handleMusic(interaction, {
			song,
			channel,
			output: outPut as 'youtube' | 'youtubemusic' | 'soundcloud',
		})
	}

	private async handleMusic(
		interaction: NinoCommand.Int,
		options: PlayMusicCommandOptions
	): Promise<void> {
		const query = options.song
		let tracks: Addable[] = []
		let player = this.container.client.music.players.get(interaction.guild?.id as string)

		if (this.container.client.music.spotify.isSpotifyUrl(query)) {
			const item = await this.container.client.music.spotify.load(query)

			switch (item?.type) {
				case SpotifyItemType.Artist: {
					tracks = await item.resolveYoutubeTracks()

					await interaction.reply(
						await resolveKey(interaction, 'music:play.spotify.artist', {
							emote: this.container.client.utils.emojis.spotify,
							tracks: tracks.length,
							art: item.name,
						})
					)
					break
				}

				case SpotifyItemType.Playlist: {
					tracks = await item.resolveYoutubeTracks()

					await interaction.reply(
						await resolveKey(interaction, 'music:play.spotify.playlist', {
							emote: this.container.client.utils.emojis.spotify,
							name: item.name,
						})
					)
					break
				}

				case SpotifyItemType.Track: {
					const track = await item.resolveYoutubeTrack()
					tracks = [track]

					await interaction.reply(
						await resolveKey(interaction, 'music:play.spotify.track', {
							emote: this.container.client.utils.emojis.spotify,
							track: item.name,
						})
					)
					break
				}

				case SpotifyItemType.Album: {
					tracks = await item.resolveYoutubeTracks()

					await interaction.reply(
						await resolveKey(interaction, 'music:play.spotify.album', {
							emote: this.container.client.utils.emojis.spotify,
							album: item.name,
						})
					)
				}
			}
		} else {
			const searchs = {
				youtube: 'ytsearch',
				youtubemusic: 'ytmsearch',
				soundcloud: 'scsearch',
			}
			// eslint-disable-next-line computed-property-spacing
			const search = searchs[options.output]

			const rest = await this.container.client.music.rest.loadTracks(
				/^https?:\/\//.test(query) ? query : `${search}:${query}`
			)

			switch (rest.loadType) {
				case 'LOAD_FAILED': {
					this.container.logger.error(rest.exception)
					break
				}

				case 'NO_MATCHES': {
					await interaction.reply(await resolveKey(interaction, 'music:play.'))
					break
				}
			}
		}

		if (!player) {
			player = this.container.client.music.createPlayer(interaction.guildId as string)
			player.queue.channel = interaction.channel as MessageChannel

			player.connect(options.channel.id, {
				deafened: true,
			})
		}
		const started = player.playing || player.paused

		player.queue.add(tracks, {
			requester: interaction.user.id,
		})

		if (!started) {
			await player.setVolume(50)
			await player.queue.start()
		}
	}
}

export interface PlayMusicCommandOptions {
	song: string
	channel: VoiceBasedChannel
	output: 'youtube' | 'youtubemusic' | 'soundcloud'
}
