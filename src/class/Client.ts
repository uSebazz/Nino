import 'dotenv/config';
import '@sapphire/plugin-i18next/register';
import mongoose from 'mongoose';
import colors from 'colors';
import glob from 'glob';
import {
	SapphireClient,
	ApplicationCommandRegistries,
	RegisterBehavior,
	LogLevel,
} from '@sapphire/framework';
import { InternationalizationContext } from '@sapphire/plugin-i18next';
import { Model, defaultData } from '../lib/database/guildConfig';
import { NinoMusic } from './Music';
import { load } from '@lavaclient/spotify';
import { promisify } from 'util';
import { PlayerEvents } from 'lavaclient';
import { Event } from './musicEvent';

const globPromise = promisify(glob);

mongoose.connect(process.env.mongourl).then(() => {
	console.log(colors.blue(`${new Date().toLocaleString()}`), '| Mongoose Connected');
});

load({
	client: {
		id: process.env.id,
		secret: process.env.secret,
	},
	autoResolveYoutubeTracks: true,
});

export class Nino extends SapphireClient {
	readonly music: NinoMusic;
	public constructor() {
		super({
			intents: 16071,
			partials: [
				'MESSAGE',
				'CHANNEL',
				'USER',
				'GUILD_MEMBER',
				'GUILD_SCHEDULED_EVENT',
				'REACTION',
			],
			presence: {
				status: 'idle',
				activities: [
					{
						name: '🌸 inv.nino.fun | dc.nino.fun',
						type: 'WATCHING',
					},
				],
			},
			i18n: {
				fetchLanguage: async (context: InternationalizationContext) => {
					if (!context.guild) return 'en-US';

					let guild = await Model.findOne({ guild: context.guild.id }).lean();
					if (!guild) guild = await Model.create(defaultData(context.guild.id));
					return guild.config.language;
				},
			},
			retryLimit: 2,
			allowedMentions: { repliedUser: false },
			defaultPrefix: 'n/',
		});
		this.music = new NinoMusic();
	}
	async start(token: string) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
		await super.login(token);
	}
	async importFile(filePath: string) {
		return (await import(filePath))?.default;
	}
	async loadMusic() {
		const musicEvents = await globPromise(`${__dirname}/../lib/music/*{.ts,.js}`);

		musicEvents.forEach(async (filePath) => {
			const event: Event<keyof PlayerEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
	}
}

declare module '@sapphire/framework' {
	export interface SapphireClient {
		readonly music: NinoMusic;
	}
	export interface Preconditions {
		inVoiceChannel: never;
		OwnerOnly: never;
	}
}
