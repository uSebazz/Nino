import "dotenv/config";
import '@sapphire/plugin-i18next/register';
import mongoose from 'mongoose';
import colors from 'colors';
import {
	SapphireClient,
	ApplicationCommandRegistries,
	RegisterBehavior,
	LogLevel,
} from '@sapphire/framework';
import type {
	TextChannel,
	ThreadChannel,
	NewsChannel,
} from 'discord.js';
import { InternationalizationContext } from '@sapphire/plugin-i18next';
import {
	Model,
	defaultData,
} from '../lib/database/guildConfig';
import { NinoMusic } from './Music';
import { load } from '@lavaclient/spotify';
import { Queue } from '../lib/function/queue';

mongoose
	.connect(
		process
			.env
			.mongourl
	)
	.then(
		() => {
			console.log(
				colors.blue(
					`${new Date().toLocaleString()}`
				),
				'| Mongoose Connected'
			);
		}
	);

load(
	{
		client: {
			id: process
				.env
				.id,
			secret: process
				.env
				.secret,
		},
		autoResolveYoutubeTracks:
			true,
	}
);

export class Nino extends SapphireClient {
	readonly music: NinoMusic;
	public constructor() {
		super(
			{
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
					activities:
						[
							{
								name: '🌸 inv.nino.fun | dc.nino.fun',
								type: 'WATCHING',
							},
						],
				},
				i18n: {
					fetchLanguage:
						async (
							context: InternationalizationContext
						) => {
							if (
								!context.guild
							)
								return 'en-US';

							let guild =
								await Model.findOne(
									{
										guild: context
											.guild
											.id,
									}
								).lean();
							if (
								!guild
							)
								guild =
									await Model.create(
										defaultData(
											context
												.guild
												.id
										)
									);
							return guild
								.config
								.language;
						},
				},
				retryLimit: 2,
				allowedMentions:
					{
						repliedUser:
							false,
					},
				defaultPrefix:
					'n/',
			}
		);
		this.music =
			new NinoMusic();
	}
	async start(
		token: string
	) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
			RegisterBehavior.Overwrite
		);
		//this.loadMusic();
		await super.login(
			token
		);
	}
}

export type MessageChannel =

		| TextChannel
		| ThreadChannel
		| NewsChannel
		| null;

declare module '@sapphire/framework' {
	export interface SapphireClient {
		readonly music: NinoMusic;
	}
	export interface Preconditions {
		inVoiceChannel: never;
		OwnerOnly: never;
	}
}

declare module 'lavaclient' {
	export interface Player {
		readonly queue: Queue;
	}
}
