import { spawnSync } from 'node:child_process';

const fileArg = process.argv.find(arg => arg.startsWith('--file='));
const markdownFile = fileArg ? fileArg.replace('--file=', '') : 'data/test.md';

spawnSync('next', ['dev'], {
	env: { ...process.env, MARKDOWN_FILE: markdownFile },
	stdio: 'inherit',
});
