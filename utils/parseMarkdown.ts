import type { Root } from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export const parseMarkdown = (content: string): Root => {
	const processor = unified().use(remarkParse);
	return processor.parse(content);
};
