import { spawnSync } from 'node:child_process';

const fileArgument = process.argv.find(argument => argument.startsWith('--file='));
const markdownFile = fileArgument ? fileArgument.replace('--file=', '') : 'data/test.md';

spawnSync('next', ['dev'], {
	env: { ...process.env, MARKDOWN_FILE: markdownFile },
	stdio: 'inherit',
});
