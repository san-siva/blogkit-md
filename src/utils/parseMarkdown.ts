import type { Root, Yaml } from 'mdast';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';

export type Frontmatter = {
	title?: string;
	description?: string;
};

export type ParseResult = {
	ast: Root;
	frontmatter: Frontmatter;
};

export const parseMarkdown = (content: string): ParseResult => {
	const processor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter, ['yaml']);
	const ast = processor.parse(content) as Root;

	let frontmatter: Frontmatter = {};

	if (ast.children[0]?.type === 'yaml') {
		const raw = (ast.children[0] as Yaml).value;
		const parsed = parseYaml(raw) as Record<string, unknown>;
		const title = parsed.title ?? parsed.name;
		frontmatter = {
			title: typeof title === 'string' ? title : undefined,
			description: typeof parsed.description === 'string' ? parsed.description : undefined,
		};
		ast.children.shift();
	}

	return { ast, frontmatter };
};
