import common from './eslint/common.config';
import react from './eslint/react.config';

export default [
	{ ignores: ['website/**'] },
	...common,
	...react,
];
