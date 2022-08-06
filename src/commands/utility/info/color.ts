import { Colors } from '#lib/structures/colors'
import { parse } from '#utils/color'
import { Command, RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced'
import { fetch } from '@sapphire/fetch'
import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js'

@RegisterSubCommand('info', (ctx) =>
	ctx //
		.setName('color')
		.setDescription('view information for a color. (hex/rgb/hsl)')
		.addStringOption((op) =>
			op //
				.setName('code')
				.setDescription('the code of color to view information for. (hex/rgb/hsl)')
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(ctx: CommandInteraction) {
		const code = ctx.options.getString('code')!
		const color = parse(code)!

		return this.getColorInfo(color, ctx)
	}

	private async getColorInfo(color: Colors, ctx: CommandInteraction) {
		const info = await this.apiCall(color.hex.toString().replace('#', ''))
		const embeds = this.getEmbed(info, color)

		return ctx.reply({ embeds })
	}

	private getEmbed(options: Response, color: Colors) {
		const embed = new MessageEmbed()
			.setTitle(`Information about ${options.name}`)
			.setDescription(`> **Hex:** ${color.hex}\n> **RGB:** ${color.rgb}\n> **HSL:** ${color.hsl}`)
		    .addField('Shades', options.shade.map((shade: string) => return `> ${shade}`)
			.addField('Tints', options.tint.map((tint: string) => return `> ${tint}`)
			.setThumbnail(options.image)
			.setImage(options.image_gradient)
			.setColor(color.hex.toString() as ColorResolvable)
		return [embed]
	}

	private apiCall(code: string) {
		return fetch<Response>(`https://api.alexflipnote.dev/colour/${code}`)
	}
}

interface Response {
	name: string
	hex: string
	shade: string[]
	tint: string[]
	image: string
	image_gradient: string
	brightness: string
}
