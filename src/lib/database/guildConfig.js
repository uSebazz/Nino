import { model, Schema } from 'mongoose';

const Schema = new Schema({
	guild: String,
	config: {
		language: String,
		//mas cosas dsp.
	},
});

export const Model = model('GuildConfig', Schema);
