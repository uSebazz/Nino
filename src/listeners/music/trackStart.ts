import { container, Listener } from '@sapphire/framework';
import { convertTime } from '../../lib/function/time';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Queue, Song } from '@lavaclient/queue';
import { NinoUtils } from '../../lib/utils';

export class trackStartListener extends Listener {
	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'trackStart',
			emitter: container.client.music,
		});
	}
	async run(queue: Queue, song: Song) {
		let utils = new NinoUtils();
		let position;
		let length2 = queue.current.length;
		let trackLength = convertTime(length2);
		const req = `<@${queue.current.requester}>`;

		if (!queue.current.isSeekable) {
			trackLength = 'Live Stream';
			position = undefined;
		}

		const embed = new MessageEmbed()
			.setDescription(
				await resolveKey(queue.channel, 'music:events.track_start', {
					emoji: utils.emojis.music,
					track: queue.current.title,
					uri: queue.current.uri,
					requester: req,
					time: trackLength,
				})
			)
			.setColor('WHITE')
			.setThumbnail(`https://img.youtube.com/vi/${queue.current.identifier}/maxresdefault.jpg`);

		queue.channel!.send({
			embeds: [embed],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setStyle('PRIMARY')
						.setCustomId('1')
						.setLabel(await resolveKey(queue.channel, 'music:events'))
				),
			],
		});
	}
}
