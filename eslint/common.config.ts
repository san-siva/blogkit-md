import tseslint, { configs as tseslintConfigs } from 'typescript-eslint';

import {
	defaultExtends,
	defaultPlugins,
	defaultRules,
	defaultSettings,
	languageOptions,
	testFiles,
} from './utilities';

export default tseslint.config(
	{
		ignores: ['node_modules/**', 'dist/**', '.next/**', 'next-env.d.ts'],
	},
	{
		files: ['**/*.ts', '**/*.js'],
		ignores: testFiles,
		plugins: defaultPlugins,
		extends: defaultExtends,
		rules: defaultRules,
		settings: defaultSettings,
		languageOptions,
	},
	{
		files: ['eslint.config.ts', 'eslint/**/*.ts'],
		extends: [tseslintConfigs.disableTypeChecked],
	}
);
