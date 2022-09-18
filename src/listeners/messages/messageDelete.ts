import { LanguageKeys } from '#lib/i18n';
import { Colors } from '#utils/constants';
import { getContent } from '#utils/util';
import { Event } from '@prisma/client';
import { Listener, type Events } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { codeBlock, cutText } from '@sapphire/utilities';
import { Message, MessageEmbed } from 'discord.js';

export class UserListener extends Listener<typeof Events.MessageDelete> {
	public override async run(message: Message<true>): Promise<void> {
		const data = await this.container.prisma.logChannel.findMany({
			where: {
				guildId: BigInt(message.guildId),
				events: {
					hasSome: [Event.all, Event.messageDelete]
				}
			}
		});
		if (!data.length) return;

		for (const logModel of data) {
			const channel = message.guild!.channels.cache.get(logModel.channelId.toString());

			if (message.author.bot || !channel || channel.type !== 'GUILD_TEXT') return;
			const embeds = await this.getEmbed(message);

			if (logModel.events.includes(Event.messageDelete) || logModel.events.includes(Event.all)) {
				await channel.send({
					embeds
				});
			}
		}
	}

	private async getEmbed(message: Message): Promise<MessageEmbed[]> {
		const attachment = message.attachments.size > 0;

		const embed = new MessageEmbed()
			.setColor(Colors.pastelGreen)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			})
			.setDescription(
				await resolveKey(message, LanguageKeys.Messages.MessageDelete, {
					channel: message.channel
				})
			)
			.addFields(
				{
					name: await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformation),
					value: attachment
						? await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformationContent, {
								content: cutText(getContent(message) || 'Attachment', 1900)
						  })
						: await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformationContent, {
								content: cutText(getContent(message) || '', 1900)
						  })
				},
				{
					name: await resolveKey(message, LanguageKeys.Messages.MessageDeleteId),
					value: codeBlock('ml', await resolveKey(message, LanguageKeys.Messages.MessageDeleteIdContent, { message }))
				}
			);

		if (attachment) embed.setImage(message.attachments.first()!.proxyURL);

		return [embed];
	}
}
