import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: false,
	entry: ['src/**/*.ts', 'src/languages/**/*.json'],
	format: ['cjs'],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es6',
	tsconfig: 'tsconfig.json',
	bundle: false,
	shims: false,
	keepNames: false,
	splitting: false,
	watch: true,
})
