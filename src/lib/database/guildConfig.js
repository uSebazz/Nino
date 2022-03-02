import mongoose from 'mongoose';

/**
 *
 * @param { String } guildId
 */
export const defaultData = (guildId) => ({
	guild: guildId,
	config: {
		language: 'es-ES',
	},
});

const GuildConfigSchema = new mongoose.Schema(
	{
		guild: String,
		config: {
			language: String,
			//mas cosas dsp.
		},
	},
	{ versionKey: false }
);

export const Model = mongoose.model('GuildConfig', GuildConfigSchema);
