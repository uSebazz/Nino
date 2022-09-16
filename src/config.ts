import { Emojis } from '#utils/constants';
import { minutes } from '#utils/function';
import type { Prisma } from '@prisma/client';
import { BucketScope, container, LogLevel } from '@sapphire/framework';
import type { InternationalizationContext } from '@sapphire/plugin-i18next';
import type { LoggerFormatOptions } from '@sapphire/plugin-logger';
import { envParseArray, envParseString } from '@skyra/env-utilities';
import { blue, green, red, yellow } from 'colorette';
import type { ClientOptions } from 'discord.js';
import { Intents, Options } from 'discord.js';

export const testServer = ['951101886684082176'];
export const OWNERS = envParseArray('CLIENT_OWNERS');

const loggerOptions: LoggerFormatOptions = {
	info: {
		timestamp: {
			pattern: 'HH:mm:ss',
			color: blue
		},
		infix: blue('INFO 〢 ')
	},
	debug: {
		timestamp: {
			pattern: 'HH:mm:ss',
			color: green
		},
		infix: green('DEBUG 〢 ')
	},
	warn: {
		timestamp: {
			pattern: 'HH:mm:ss',
			color: yellow
		},
		infix: yellow('WARN 〢 ')
	},
	error: {
		timestamp: {
			pattern: 'HH:mm:ss',
			color: red
		},
		infix: red('ERROR 〢 ')
	}
};

/* const STAT_CORD_OPTIONS: StatcordOptions = {
	client_id: envParseString('CLIENT_ID'),
	key: envParseString('STATCORD_TOKEN'),
	autopost: false
}; */

export const CLIENT_OPTIONS: ClientOptions = {
	regexPrefix: /^(hey +)?Nino[,! ]/i,
	allowedMentions: { users: [], roles: [] },
	subcommandsAdvanced: { nameCommandsAutogenerated: true },
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: ['Nino'],
	loadDefaultErrorListeners: false,
	loadMessageCommandListeners: true,
	preventFailedToFetchLogForGuilds: [
		'876339668956893216',
		'877560701416259625',
		'880099532417941524',
		'925909747994071111',
		'844856727517003818',
		'726505646073315408',
		'806611727684599838'
	],
	restTimeOffset: 0,
	shards: 'auto',
	partials: ['MESSAGE', 'CHANNEL', 'USER', 'GUILD_MEMBER'],
	sweepers: {
		...Options.defaultSweeperSettings,
		messages: {
			interval: minutes.toSeconds(3),
			lifetime: minutes.toSeconds(15)
		}
	},
	intents: Object.values(Intents),
	logger: {
		level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug,
		format: loggerOptions
	},
	presence: {
		activities: [
			{
				name: 'nwn pepe',
				type: 'WATCHING'
			}
		],
		status: 'idle'
	},
	// statcord: STAT_CORD_OPTIONS,
	i18n: {
		fetchLanguage: async (context: InternationalizationContext) => {
			if (!context.guild) return 'en-US';

			let data = await container.prisma.serverConfig.findUnique({
				where: {
					guildId: context.guild.id
				}
			});
			let config: Prisma.ServerConfigCreateInput;

			if (!data) {
				// eslint-disable-next-line @typescript-eslint/no-extra-semi
				(config = {
					guildId: context.guild.id,
					lang: 'es-ES'
				}),
					(data = await container.prisma.serverConfig.create({
						data: config
					}));
			}

			return data.lang;
		},
		i18next: {
			interpolation: {
				defaultVariables: {
					wrong: Emojis.wrong,
					right: Emojis.right,
					excl: Emojis.excl,
					netual: Emojis.netual,
					setting: Emojis.setting,
					ninoheart: Emojis.ninoheart,
					ninozzz: Emojis.ninozzz
				},
				escapeValue: false
			}
		},
		hmr: {
			enabled: true
		}
	},
	defaultCooldown: {
		delay: 10_000, // 10s
		filteredUsers: OWNERS, // bot owners
		limit: 2, // Limit 2 commands for second
		scope: BucketScope.User // Scope User
	}
};
