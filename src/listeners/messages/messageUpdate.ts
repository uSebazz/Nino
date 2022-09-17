import { LanguageKeys } from '#lib/i18n';
import { Colors } from '#utils/constants';
import { Event } from '@prisma/client';
import { Listener, type Events } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { codeBlock } from '@sapphire/utilities';
import { Change, diffWordsWithSpace } from 'diff';
import { Message, MessageEmbed } from 'discord.js';

export class UserListener extends Listener<typeof Events.MessageUpdate> {
	public override async run(oldMessage: Message<true>, newMessage: Message<true>): Promise<void> {
		const data = await this.container.prisma.logChannel.findMany({
			where: {
				guildId: BigInt(oldMessage.guildId),
				events: {
					has: Event.messageUpdate
				}
			}
		});

		if (!data.length) return;

		for (const logModel of data) {
			const channel = newMessage.guild!.channels.cache.get(logModel.channelId.toString());

			if (oldMessage.author.bot || oldMessage.content === newMessage.content || !channel || channel.type !== 'GUILD_TEXT') return;
			const embeds = await this.getEmbed(oldMessage, newMessage);

			if (logModel.events.includes(Event.messageUpdate) || logModel.events.includes(Event.all)) {
				await channel.send({
					embeds
				});
			}
		}
	}

	private async getEmbed(oldMessage: Message<true>, newMessage: Message<true>): Promise<MessageEmbed[]> {
		const embed = new MessageEmbed()
			.setAuthor({
				name: newMessage.author.tag,
				iconURL: newMessage.author.displayAvatarURL()
			})
			.setDescription(
				await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdate, {
					channel: oldMessage.channel
				})
			)
			.addFields(
				{
					name: await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateInformation),
					value: await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateInformationContent, {
						before: oldMessage.content,
						after: diffWordsWithSpace(oldMessage.content, newMessage.content)
							.map((ctx: Change): string => (ctx.added ? `**${ctx.value}**` : ctx.removed ? `~~${ctx.value}~~` : ctx.value))
							.join(' ')
					})
				},
				{
					name: await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateId),
					value: codeBlock(
						'ml',
						await resolveKey(newMessage, LanguageKeys.Messages.MessageUpdateIdContent, {
							newMessage
						})
					)
				}
			)
			.setColor(Colors.pastelGreen);

		return [embed];
	}
}
