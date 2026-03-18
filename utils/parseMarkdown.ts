import type { Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export const parseMarkdown = (content: string): Root => {
	const processor = unified().use(remarkParse).use(remarkGfm);
	return processor.parse(content) as Root;
};
