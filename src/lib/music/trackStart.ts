import { Event } from '../../class/musicEvent';

export default new Event('trackStart', async (track: string) => {
	console.log(track);
});
