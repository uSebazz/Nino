import { Colors } from '#lib/structures/colors';
import { HEX } from '#lib/structures/colors/HEX';
import { HSL } from '#lib/structures/colors/HSL';

export class RGB implements Colors {
	public r: number; // red
	public g: number; // green
	public b: number; // blue

	public constructor(r: string | number, g: string | number, b: string | number) {
		this.r = Number(r);
		this.g = Number(g);
		this.b = Number(b);

		this.check();
	}

	public check() {
		if (this.r < 0 || this.r > 255) {
			throw new Error('red must be between 0 and 255');
		}
		if (this.g < 0 || this.g > 255) {
			throw new Error('green must be between 0 and 255');
		}
		if (this.b < 0 || this.b > 255) {
			throw new Error('blue must be between 0 and 255');
		}
	}

	public get rgb() {
		return this;
	}

	public get hex() {
		return new HEX(this.r.toString(16), this.g.toString(16), this.b.toString(16));
	}

	public get hsl() {
		const r = this.r / 255;
		const g = this.g / 255;
		const b = this.b / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h: number;
		let s: number;
		const l = (max + min) / 2;

		if (max === min) {
			/* Achromatic */
			h = 0;
			s = 0;
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
				// no default
			}
			h! /= 6;
		}

		return new HSL(Math.round(h! * 360), Math.round(s * 100), Math.round(l * 100));
	}

	public toString() {
		return String(`rgb(${this.r}, ${this.g}, ${this.b})`);
	}
}
