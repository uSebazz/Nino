export * from '#lib/structures/colors/HEX'
export * from '#lib/structures/colors/HSL'
export * from '#lib/structures/colors/RGB'

// This is a copy of Skyra Project's code: https://github.com/skyra-project/skyra/blob/main/src/lib/structures/color/index.ts
// All credits to Skyra Project
export interface Colors {
	check(): void
	toString(): string
	readonly rgb: import('./RGB').RGB
	readonly hex: import('./HEX').HEX
	readonly hsl: import('./HSL').HSL
}
