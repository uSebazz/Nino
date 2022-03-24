import { NinoCommand } from '../../class/command';
import { ApplyOptions } from '@sapphire/decorators';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<NinoCommand.Options>({
	description: 'Skip a song',
	preconditions: ['inVoiceChannel'],
})
export class SkipSongCommand extends NinoCommand {
	public override registerApplicationCommands(registry: NinoCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}
	public override async chatInputRun(interaction: NinoCommand.Int) {
		const player = this.container.client.music.players.get(interaction.guildId);

		if (!player) {
			return interaction.reply({
				content: await resolveKey(interaction.channel, 'music:skip.noplayer'),
				ephemeral: true,
			});
		}

		if (player.queue.tracks.length == 0 || player.queue.tracks.length == 1) {
			return interaction.reply({
				content: await resolveKey(interaction.channel, 'music:skip.notrack'),
				ephemeral: true,
			});
		}

		await player?.queue.next();

		return interaction.reply({
			content: await resolveKey(interaction.channel, 'music:skip.done', {
				track: player.queue.current.title,
			}),
		});
	}
}
