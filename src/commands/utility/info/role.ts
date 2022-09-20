import { NinoCommand } from '#lib/structures';
import { Colors } from '#utils/constants';
import { RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { MessageEmbed, Role } from 'discord.js';

@RegisterSubCommand('info', (builder) =>
	builder
		.setName('role')
		.setDescription('📍 Get info about a role.')
		.addRoleOption((op) =>
			op //
				.setName('role')
				.setDescription('🍥 The role to display information of')
				.setRequired(true)
		)
)
export class UserCommand extends NinoCommand {
	public override chatInputRun(interaction: NinoCommand.Interaction) {
		const role = interaction.options.getRole('role') as Role;

		return this.makeEmbed(interaction, {
			title: role.name,
			id: role.id,
			createdAt: role.createdTimestamp,
			position: role.position,
			color: role.color,
			mentionable: role.mentionable,
			hoist: role.hoist,
			iconURL: role.icon ?? ''
		});
	}

	private makeEmbed(interaction: NinoCommand.Interaction, options: RoleOptions) {
		const embed = new MessageEmbed()
			.setAuthor({ name: options.title, iconURL: options.iconURL ?? '' })
			.setColor(Colors.hazyDaze)
			.addFields([
				{
					name: '» Role',
					value: `> **ID**: ${options.id}\n> **Position**: ${options.position}\n> **Created At**: <t:${Math.round(
						options.createdAt / 1000
					)}:R> `
				},
				{
					name: '» Extra Data',
					value: `> **Color**: ${options.color}\n> **Hoisted**: ${options.hoist}\n> **Mentionable**: ${options.mentionable}`
				}
			])
			.setFooter({ text: `Request by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

		return interaction.reply({
			embeds: [embed]
		});
	}
}

interface RoleOptions {
	title: string;
	id: string;
	createdAt: number;
	position: number;
	iconURL?: string;
	color: number;
	mentionable: boolean;
	hoist: boolean;
}
