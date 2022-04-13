import { container, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { generate } from 'spotify-card'
import type { Queue } from '@lavaclient/queue'
import type { CustomSongData } from 'spotify-card/dist/types'
import { MessageAttachment } from 'discord.js'

@ApplyOptions<Listener.Options>({ event: 'trackStart', emitter: container.client.music })
export class trackStartListener extends Listener {
	public async run(queue: Queue): Promise<void> {
		//const player = this.container.client.music.players.get(queue.channel!.guildId)

		const img = await generate({
			url: queue.current!.uri,
			songData: {
				title: queue.current!.title,
				cover: `https://img.youtube.com/vi/${
					queue.current!.identifier
				}/maxresdefault.jpg`,
				artist: queue.current!.author,
			} as CustomSongData,
			fontSizes: {
				title: 55,
			},
			blur: {
				image: true,
			},
		})

		const attachement = new MessageAttachment(img, 'spotify-card.png')

		await queue.channel!.send({
			content: `Now playing: **${queue.current!.title}**`,
			files: [attachement],
		})
	}
}
