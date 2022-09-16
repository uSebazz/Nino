import { LanguageKeys } from '#lib/i18n';
import { Colors } from '#utils/constants';
import { getContent } from '#utils/util';
import { Listener, type Events } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { codeBlock, cutText } from '@sapphire/utilities';
import { Message, MessageEmbed } from 'discord.js';

export class UserListener extends Listener<typeof Events.MessageDelete> {
	public override async run(message: Message) {
		const data = await this.container.prisma.eventsConfig.findUnique({
			where: {
				guildId: message.guildId!
			}
		});
		if (!data) return;

		const channel = message.guild!.channels.cache.get(data!.channelId!);

		if (message.author.bot || !channel || channel.type !== 'GUILD_TEXT') return;
		const embeds = await this.getEmbed(message);

		if (data?.all || data?.events.includes('messageDelete')) {
			await channel.send({
				embeds
			});
		}
	}

	private async getEmbed(message: Message) {
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
			.addField(
				await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformation),
				attachment
					? await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformationContent, {
							content: cutText(getContent(message) || 'Attachment', 1900)
					})
					: await resolveKey(message, LanguageKeys.Messages.MessageDeleteInformationContent, {
							content: cutText(getContent(message) || '', 1900)
					})
			)
			.addField(
				await resolveKey(message, LanguageKeys.Messages.MessageDeleteId),
				codeBlock('ml', await resolveKey(message, LanguageKeys.Messages.MessageDeleteIdContent, { message }))
			);
		if (attachment) embed.setImage(message.attachments.first()!.proxyURL);
		return [embed];
	}
}
