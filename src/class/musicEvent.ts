import { PlayerEvents } from 'lavaclient';

export class Event<Key extends keyof PlayerEvents> {
	constructor(public event: Key, public run: (...args: Parameters<PlayerEvents[Key]>) => void) {}
}
