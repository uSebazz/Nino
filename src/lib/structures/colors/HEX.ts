import { Colors } from '#lib/structures/colors';
import { RGB } from '#lib/structures/colors/RGB';

export class HEX implements Colors {
	public r: string; // red
	public g: string; // green
	public b: string; // blue

	public constructor(r: string, g: string, b: string) {
		this.r = r.padStart(2, '0');
		this.g = g.padStart(2, '0');
		this.b = b.padStart(2, '0');

		this.check();
	}

	public check() {
		if (Number.isNaN(parseInt(this.r, 16))) {
			throw new Error('red must be a number');
		}
		if (Number.isNaN(parseInt(this.g, 16))) {
			throw new Error('green must be a number');
		}
		if (Number.isNaN(parseInt(this.b, 16))) {
			throw new Error('blue must be a number');
		}
	}

	public get hex() {
		return this;
	}

	public get rgb() {
		return new RGB(parseInt(this.r, 16), parseInt(this.g, 16), parseInt(this.b, 16));
	}

	public get hsl() {
		return this.rgb.hsl;
	}

	public toString() {
		return `#${this.r}${this.g}${this.b}`;
	}
}
