import { LanguageKeys } from '#lib/i18n';
import { Colors } from '#lib/structures/colors';
import { parse } from '#utils/color';
import { Command, RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { fetch } from '@sapphire/fetch';
import { resolveKey } from '@sapphire/plugin-i18next';
import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';

@RegisterSubCommand('info', (ctx) =>
	ctx //
		.setName('color')
		.setDescription('📍 Get information about a color HEX.')
		.addStringOption((op) =>
			op //
				.setName('code')
				.setDescription('🆔 Hex code of the color.')
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(ctx: CommandInteraction) {
		const code = ctx.options.getString('code')!;
		const color = parse(code)!;

		return this.getColorInfo(color, ctx);
	}

	private async getColorInfo(color: Colors, ctx: CommandInteraction) {
		const info = await this.apiCall(color.hex.toString().replace('#', ''));
		const embeds = await this.getEmbed(info, color, ctx);

		return ctx.reply({ embeds });
	}

	private async getEmbed(options: Response, color: Colors, ctx: CommandInteraction) {
		const embed = new MessageEmbed()
			.setTitle(
				await resolveKey(ctx, LanguageKeys.Util.Color.ColorInfo, {
					options
				})
			)
			.setDescription(`> **Hex:** ${color.hex}\n> **RGB:** ${color.rgb}\n> **HSL:** ${color.hsl}`)
			.addFields([
				{
					name: await resolveKey(ctx, LanguageKeys.Util.Color.ColorShades),
					value: `> ${options.shade.map((v) => `#${v}`).join(', ')}`
				},
				{
					name: await resolveKey(ctx, LanguageKeys.Util.Color.ColorTints),
					value: `> ${options.tint.map((v) => `#${v}`).join(', ')}`
				}
			])
			.setThumbnail(options.image)
			.setImage(options.image_gradient)
			.setColor(color.hex.toString() as ColorResolvable);
		return [embed];
	}

	private apiCall(code: string) {
		return fetch<Response>(`https://api.alexflipnote.dev/colour/${code}`);
	}
}

interface Response {
	name: string;
	hex: string;
	shade: string[];
	tint: string[];
	image: string;
	image_gradient: string;
	brightness: string;
}
