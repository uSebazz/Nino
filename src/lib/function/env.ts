import { load } from 'ts-dotenv';

export const env = load({
	token: String,
	ip: String,
	pass: String,
	mongourl: String,
	id: String,
	secret: String,
});
