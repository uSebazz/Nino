import { container, Listener } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { Queue } from '@lavaclient/queue'
//import { MessageAttachment } from 'discord.js'

@ApplyOptions<Listener.Options>({ event: 'trackStart', emitter: container.client.music })
export class trackStartListener extends Listener {
	public async run(queue: Queue): Promise<void> {
		//const player = this.container.client.music.players.get(queue.channel!.guildId)

		//const canvas = Canvas.createCanvas(500, 500)
		//const ctx = canvas.getContext('2d')
		//ctx.fillStyle = '#ff0000'
		//ctx.fillRect(0, 0, 500, 500)
		//const attachment = new MessageAttachment(canvas.toBuffer(), 'spotify-card.png')
		//const embed = new MessageEmbed()
		//	.setTitle('Spotify Card')
		//	.setDescription('A spotify card')
		//	.attachFiles(attachment)
		//	.setImage('attachment://spotify-card.png')
		await queue.channel!.send({
			content: `Now playing: **${queue.current!.title}**`,
			//files: [attachement],
		})
	}
}
