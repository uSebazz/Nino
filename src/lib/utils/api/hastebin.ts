import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
interface HastebinResponse {
	key: string;
}

export async function getHaste(result: string, language = 'js') {
	const { key } = await fetch<HastebinResponse>(
		`https://hastebin.skyra.pw/documents`,
		{
			method: FetchMethods.Post,
			body: result
		},
		FetchResultTypes.JSON
	);
	return `https://hastebin.skyra.pw/${key}.${language}`;
}
