export class NinoUtils {
	public emojis = {
		music: '',
		check: '<:Check_Mark:924321938715856951>',
		fail: '<:Fail_Cross:924321864912875560>',
	};
	public colors = {
		music: {
			track_loaded: 'WHITE',
		},
	};
}

console.log(new NinoUtils().emojis.fail);
