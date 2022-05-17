import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: false,
	entry: ['src/**/*.ts'],
	format: ['cjs'],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2021',
	tsconfig: 'tsconfig.json',
	bundle: false,
	shims: false,
	keepNames: true,
	splitting: false,
})
