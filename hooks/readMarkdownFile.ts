import { readFile } from 'node:fs/promises';
import path from 'node:path';

import '@/utils/devReloadTrigger';
import { parseMarkdown } from '@/utils/parseMarkdown';
import type { RenderedMarkdown } from '@/utils/renderMarkdown';
import { renderMarkdownAst } from '@/utils/renderMarkdown';

type MarkdownFileResult =
	| { success: true; rendered: RenderedMarkdown }
	| { success: false; error: string };

export const readMarkdownFile = async (
	filePath: string | undefined
): Promise<MarkdownFileResult> => {
	if (!filePath) {
		return {
			success: false,
			error:
				'MARKDOWN_FILE env variable is required. Usage: MARKDOWN_FILE=data/test.md npm run dev',
		};
	}

	const absolutePath = path.join(process.cwd(), filePath);

	let content: string;
	try {
		content = await readFile(absolutePath, 'utf8');
	} catch {
		return {
			success: false,
			error: `Could not read file: "${filePath}". Make sure the path is correct and the file exists.`,
		};
	}

	if (!content.trim()) {
		return { success: false, error: `File "${filePath}" is empty.` };
	}

	const { ast } = parseMarkdown(content);
	const rendered = renderMarkdownAst(ast);

	return { success: true, rendered };
};
