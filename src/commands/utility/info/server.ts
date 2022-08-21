import { LanguageKeys } from '#lib/i18n';
import { Badges, Colors, Emojis } from '#utils/constants';
import { Command, RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { resolveKey } from '@sapphire/plugin-i18next';
import { CommandInteraction, Guild, MessageEmbed } from 'discord.js';

@RegisterSubCommand('info', (ctx) =>
	ctx
		//
		.setName('server')
		.setDescription('Get information about the server.')
		.addStringOption((op) =>
			op
				//
				.setName('id')
				.setDescription('The ID of the server. (this is only work if me is in the server)')
				.setRequired(false)
		)
)
export class UserCommand extends Command {
	public override chatInputRun(ctx: CommandInteraction) {
		const id = ctx.options.getString('id', false);

		if (id) {
			return this.showServerInfoById(ctx, id);
		}

		return this.showServerInfo(ctx);
	}

	private async showServerInfo(ctx: CommandInteraction) {
		const server = ctx.guild!;
		const embeds = await this.makeEmbed(server);
		return ctx.reply({ embeds });
	}

	private async showServerInfoById(ctx: CommandInteraction, id: string) {
		const server = await this.container.client.guilds.cache.get(id);
		if (!server) {
			return ctx.reply(`Server [${id}] isn't in cache 😢`);
		}
		const embeds = await this.makeEmbed(server);
		return ctx.reply({ embeds });
	}

	private async makeEmbed(server: Guild) {
		const owner = await server.fetchOwner();
		const features = await this.getFeatures(server);
		const badges = this.getServerBadges(server);
		const humans = server.members.cache.filter((v) => !v.user.bot).size;
		const bots = server.members.cache.filter((v) => v.user.bot).size;
		const textChannels = server.channels.cache.filter((v) => v.type === 'GUILD_TEXT').size;
		const voiceChannels = server.channels.cache.filter((v) => v.type === 'GUILD_VOICE').size;
		const stages = server.channels.cache.filter((v) => v.type === 'GUILD_STAGE_VOICE').size;

		const embed = new MessageEmbed()
			.setColor(Colors.tanagerTurquoise)
			.setAuthor({ name: server.name, iconURL: server.iconURL()! })
			.setDescription(`${badges} ${server.description ?? ''}`)
			.addFields([
				{
					name: await resolveKey(server, LanguageKeys.Util.Server.ServerInfo),
					value: await resolveKey(server, LanguageKeys.Util.Server.ServerInfoValue, {
						owner,
						server,
						time: Math.round(server.createdTimestamp / 1000)
					})
				},
				{
					name: '» Statistics',
					value: `> **Members [${server.memberCount}]**: ${Emojis.user} ${humans} | ${Emojis.bot} ${bots}\n> **Channels [${server.channels.cache.size}]**: ${Emojis.guildText} ${textChannels} | ${Emojis.guildVoice} ${voiceChannels} | ${Emojis.guildStage} ${stages}`
				},
				{
					name: '» Features',
					value: `> ${features}`
				}
			]);

		return [embed];
	}

	private async getFeatures(server: Guild) {
		const featuresList: Array<string> = [];

		for (const feature of server.features) {
			const key = await resolveKey(server, `features:${feature}`);
			featuresList.push(key);
		}

		return featuresList.join(', ');
	}

	private getServerBadges(server: Guild) {
		const badges: Array<string> = [];

		if (server.verified) {
			badges.push(Badges.SERVER_VERIFIED);
		}

		if (server.partnered) {
			badges.push(Badges.SERVER_PARTNER);
		}

		return badges.join(' ') || ''; // Esta cosa todavia no se si funcione jajajajajajj
	}
}
