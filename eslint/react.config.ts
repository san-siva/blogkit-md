import tseslint from 'typescript-eslint';

import {
	languageOptions,
	reactExtends,
	reactPlugins,
	reactRules,
	reactSettings,
	testFiles,
} from './utilities';

export default tseslint.config({
	files: ['**/*.tsx', '**/*.jsx'],
	ignores: testFiles,
	plugins: reactPlugins,
	extends: reactExtends,
	rules: reactRules,
	settings: reactSettings,
	languageOptions,
});
