import { Json, safeFetch } from '@skyra/safe-fetch';
interface HastebinResponse {
	key: string;
}

export async function getHaste(result: string, language = 'js') {
	const { key } = (
		await Json<HastebinResponse>(
			safeFetch(`https://hastebin.skyra.pw/documents`, {
				method: 'POST',
				body: result
			})
		)
	).unwrap();

	return `https://hastebin.skyra.pw/${key}.${language}`;
}
