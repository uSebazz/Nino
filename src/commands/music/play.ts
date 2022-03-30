import { NinoCommand } from '../../class/command'
import { ApplyOptions } from '@sapphire/decorators'
import { SpotifyItemType } from '@lavaclient/spotify'
import type { Addable } from '@lavaclient/queue'

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
		registry.registerChatInputCommand((builder) =>
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
				)
		)
	}
	public override chatInputRun(interaction: NinoCommand.Int) {
		const outPut = interaction.options.getString('type') ?? 'youtube'
		const song = interaction.options.getString('query') as string

		return this.handleMusic(interaction, {
			song,
			output: outPut as 'youtube' | 'youtubemusic' | 'soundcloud',
		})
	}

	private async handleMusic(
		interaction: NinoCommand.Int,
		options: PlayMusicCommandOptions
	): Promise<void> {
		const query = options.song
		// @ts-expect-error TypeScript doesn't know that the type is a string
		let tracks: Addable[] = []

		if (this.container.client.music.spotify.isSpotifyUrl(query)) {
			const item = await this.container.client.music.spotify.load(query)

			switch (item?.type) {
				case SpotifyItemType.Artist: {
					tracks = await item.resolveYoutubeTracks()

					await interaction.reply('Searching for artist...')
					break
				}
				case SpotifyItemType.Album: {
					tracks = await item.resolveYoutubeTracks()

					await interaction.reply('Searching for album...')
					break
				}
				case SpotifyItemType.Track: {
					const track = await item.resolveYoutubeTrack()
					tracks = [track]

					await interaction.reply('Searching for track...')
					break
				}
				case SpotifyItemType.Playlist: {
					tracks = await item.resolveYoutubeTracks()

					await interaction.reply('Searching for playlist...')
					break
				}
			}

			switch (options.output) {
				case 'youtube': {
					const result = await this.container.client.music.rest.loadTracks(
						/^https?:\/\//.test(query) ? query : `ytsearch:${query}`
					)

					switch (result.loadType) {
						case 'LOAD_FAILED': {
							this.container.logger.error('Failed to load tracks')
						}
					}
					break
				}
				case 'youtubemusic': {
					break
				}
				case 'soundcloud': {
					break
				}
			}
		}
	}
}

export interface PlayMusicCommandOptions {
	song: string
	output: 'youtube' | 'youtubemusic' | 'soundcloud'
}
