import { LanguageKeys } from '#lib/i18n';
import { formatMessage } from '#utils/commons';
import { Colors } from '#utils/constants';
import { Event } from '@prisma/client';
import { Listener, type Events } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Collection, Message, MessageAttachment, MessageEmbed, Snowflake } from 'discord.js';

type MessagesType = Collection<Snowflake, Message<true>>;

export class UserListener extends Listener<typeof Events.MessageBulkDelete> {
	public override async run(messages: MessagesType): Promise<void> {
		const messageFirst = messages.first()!;

		const data = await this.container.prisma.logChannel.findMany({
			where: {
				guildId: BigInt(messageFirst.guildId),
				events: {
					has: Event.messageBulkDelete
				}
			}
		});

		if (!data.length) return;

		for (const logModel of data) {
			const channel = messageFirst.guild.channels.cache.get(logModel.channelId.toString());
			if (!channel || channel.type !== 'GUILD_TEXT') return;

			const embeds = await this.getEmbed(messages, messageFirst);

			if (logModel.events.includes(Event.messageBulkDelete) || logModel.events.includes(Event.all)) {
				await channel.send({
					files: [this.getAttachment(messages)],
					embeds
				});
			}
		}
	}

	private getAttachment(messages: MessagesType): MessageAttachment {
		const procesed = messages
			.map((messages: Message<true>): string => formatMessage(messages))
			.reverse()
			.join('\n');

		const buffer = Buffer.from(procesed);
		return new MessageAttachment(buffer, 'purge.txt');
	}

	private async getEmbed(collection: MessagesType, message: Message): Promise<MessageEmbed[]> {
		const embed = new MessageEmbed()
			.setDescription(
				await resolveKey(message, LanguageKeys.Messages.MessageDeleteBulk, {
					amount: collection.size,
					channel: message.channel
				})
			)
			.setColor(Colors.pastelGreen);

		return [embed];
	}
}
