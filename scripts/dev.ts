import { exec, spawn } from 'node:child_process';
import { watch, writeFileSync } from 'node:fs';
import path from 'node:path';

const fileArgument = process.argv.find(argument => argument.startsWith('--file='));
const markdownFile = fileArgument ? fileArgument.replace('--file=', '') : 'data/test.md';

const markdownPath = path.join(process.cwd(), markdownFile);
const triggerPath = path.join(process.cwd(), 'utils/devReloadTrigger.ts');

watch(markdownPath, () => {
	writeFileSync(triggerPath, `export const reloadTrigger = '${Date.now()}';\n`);
});

const child = spawn('next', ['dev'], {
	env: { ...process.env, MARKDOWN_FILE: markdownFile },
	stdio: ['inherit', 'pipe', 'inherit'],
});

let browserOpened = false;

child.stdout?.on('data', (chunk: Buffer) => {
	process.stdout.write(chunk);
	if (!browserOpened) {
		const match = chunk.toString().match(/http:\/\/localhost:\d+/);
		if (match) {
			browserOpened = true;
			exec(`open ${match[0]}`);
		}
	}
});

child.on('exit', code => {
	process.exit(code ?? 0);
});
