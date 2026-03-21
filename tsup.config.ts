import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	outExtension: () => ({ js: '.js' }),
	tsconfig: 'tsconfig.build.json',
	dts: true,
	clean: true,
	external: ['react', 'react-dom', 'next', '@san-siva/blogkit', '@san-siva/stylekit'],
});
