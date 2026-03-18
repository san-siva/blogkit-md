import { exec, spawn } from 'node:child_process';
import { stat, writeFileSync } from 'node:fs';
import path from 'node:path';

const fileArgument = process.argv.find(argument => argument.startsWith('--file='));
const markdownFile = fileArgument ? fileArgument.replace('--file=', '') : 'data/test.md';

const markdownPath = path.join(process.cwd(), markdownFile);
const triggerPath = path.join(process.cwd(), 'utils/devReloadTrigger.ts');

let lastMtime: number | null = null;

const checkMarkdownFile = () => {
	stat(markdownPath, (error, stats) => {
		if (error) return;
		const { mtimeMs } = stats;
		if (lastMtime !== null && mtimeMs !== lastMtime) {
			writeFileSync(triggerPath, `export const reloadTrigger = '${mtimeMs}';\n`);
		}
		lastMtime = mtimeMs;
	});
};

setInterval(checkMarkdownFile, 500);
checkMarkdownFile();

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
