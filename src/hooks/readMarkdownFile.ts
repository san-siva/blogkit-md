import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Frontmatter } from '../utils/parseMarkdown';
import { parseMarkdown } from '../utils/parseMarkdown';
import type { RenderedMarkdown } from '../utils/renderMarkdown';
import { renderMarkdownAst } from '../utils/renderMarkdown';

type MarkdownFileResult =
	| ({ success: true; rendered: RenderedMarkdown } & Frontmatter)
	| { success: false; error: string };

export const readMarkdownFile = async (
	filePath: string | undefined
): Promise<MarkdownFileResult> => {
	if (!filePath) {
		return { success: false, error: 'No file path provided.' };
	}

	const absolutePath = path.isAbsolute(filePath)
		? filePath
		: path.join(process.cwd(), filePath);

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

	const { ast, frontmatter } = parseMarkdown(content);
	const rendered = renderMarkdownAst(ast);

	return { success: true, rendered, ...frontmatter };
};
