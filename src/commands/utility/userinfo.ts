import { NinoCommand, type NinoCommandOptions, type NinoCommandRegistery } from '#lib/structures'
import { ApplyOptions } from '@sapphire/decorators'
//import { envParseString } from '@skyra/env-utilities'
//import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch'
//import { createCanvas } from 'canvas'
//import { read } from 'jimp'
import type { Message, CommandInteraction } from 'discord.js'
//import moment from 'moment'

@ApplyOptions<NinoCommandOptions>({
	description: 'view user information',
	aliases: ['ui', 'user', 'info-user', 'whois']
})
export class UserCommand extends NinoCommand {
	public override registerApplicationCommands(registery: NinoCommandRegistery) {
		registery.registerChatInputCommand((builder) =>
			builder
				//
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option
						//
						.setName('user')
						.setDescription('the user to view information about')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						//
						.setName('type')
						.setDescription('type of information to view')
						.setRequired(false)
						.setChoices({ name: 'canvas', value: 'canvas' })
				)
		)
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply('Not implemented yet')
	}

	public override messageRun(message: Message) {
		return message.reply('Not implemented yet')
	}

	/*private async canvas(user: User) {
		let userName = user.username
		if (userName.length >= 10) userName = `${userName.substring(0, 10)}...`

		const canvas = createCanvas(885, 303)
		const ctx = canvas.getContext('2d')

		ctx.font = '80px Helvetica Bold'
		ctx.textAlign = 'left'
		ctx.fillStyle = '#FFFFFF'
		ctx.fillText(userName, 300, 155)

		const textMetric = ctx.measureText(userName)

		ctx.font = '60px Helvetica Normal'
		ctx.textAlign = 'left'
		ctx.fillStyle = '#c7c7c7'
		ctx.fillText(`#${user.discriminator}`, 300, 215)

		ctx.font = '23px Helvetica Normal'
		ctx.textAlign = 'center'
		ctx.fillStyle = '#c7c7c7'
		ctx.fillText(`${moment(user.createdAt).format('MMM DD, YYYY')}`, 775, 273)

		const userAvatar = user.avatarURL({ format: 'png', size: 1024 }) as string
		let background = userAvatar

		if (user.bannerURL()) {
			background = user.bannerURL({ format: 'png', dynamic: false }) as string
		}

		// read bases image for the background
		const canvasJimp = await read(canvas.toBuffer())
		const base = await read(`${process.cwd()}/src/lib/assets/canvas/base.png`)
		const profile = await read(`${process.cwd()}/src/lib/assets/canvas/profile.png`)
		const mask = await read(`${process.cwd()}/src/lib/assets/canvas/mask.png`)
		const mark = await read(`${process.cwd()}/src/lib/assets/canvas/mark.png`)
		const empty = await read(`${process.cwd()}/src/lib/assets/canvas/empty.png`)

		// Avatar and background
		const avatarBackground = await read(background)
		const avatarProfile = await read(userAvatar)


	}*/
}
