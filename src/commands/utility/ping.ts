import { LanguageKeys } from '#lib/i18n';
import { NinoCommand } from '#lib/structures';
import { Emojis } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';

@ApplyOptions<NinoCommand.Options>({
	description: 'Ping of the bot',
	aliases: ['pong', 'latency']
})
export class UserCommand extends NinoCommand {
	public override async messageRun(message: Message<true>) {
		const msg = await send(message, `${Emojis.ninoburrito} ping?`);
		const { diff, ping } = this.getPing(msg, message);

		await send(message, await resolveKey(message, LanguageKeys.Util.Ping, { diff, ping }));
	}

	public override async chatInputRun(interaction: NinoCommand.Interaction<'cached'>) {
		const msg = await interaction.reply({
			content: `${Emojis.ninoburrito} ping?`,
			fetchReply: true
		});

		const { diff, ping } = this.getPing(msg, interaction);

		await msg.edit(
			await resolveKey(interaction, LanguageKeys.Util.Ping, {
				diff,
				ping
			})
		);
	}

	private getPing(message: Message<boolean>, interaction: NinoCommand.Interaction<'cached'> | Message<true>) {
		const diff = (message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp;
		const ping = Math.round(this.container.client.ws.ping);

		return { diff, ping };
	}
}
