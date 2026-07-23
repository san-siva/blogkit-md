import type { Heading, Root, Yaml } from 'mdast';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';

import { extractText } from './extractText';

export type ParseResult = {
	ast: Root;
	title: string | undefined;
	description: string | undefined;
};

const getPageInfoFromSections = (ast: Root) => {
	const firstSection = ast?.children?.[0];
	if (!firstSection) return;

	const isFirstSectionHeading = firstSection.type === 'heading';
	if (!isFirstSectionHeading) return;

	const isFirstSectionAValidHeader = (firstSection as Heading).depth === 1;
	if (!isFirstSectionAValidHeader) return;

	const title = extractText((ast.children[0] as Heading).children);

	// to avoid re-printing the same header twice;
	ast.children.shift();

	return { title };
};

const getPageInfoFromYaml = (ast: Root) => {
	if (ast?.children?.[0]?.type !== 'yaml') return;
	const raw = (ast.children[0] as Yaml).value;
	ast.children.shift();
	try {
		const parsed = parseYaml(raw) as Record<string, unknown>;
		const title = parsed.title ?? parsed.name;
		return {
			title: typeof title === 'string' ? title : undefined,
			description:
				typeof parsed.description === 'string' ? parsed.description : undefined,
		};
	} catch {
		return;
	}
};

export const parseMarkdown = (content: string): ParseResult => {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkFrontmatter, ['yaml']);
	const ast = processor.parse(content) as Root;
	const { title, description } =
		getPageInfoFromYaml(ast) ?? getPageInfoFromSections(ast) ?? {};
	return {
		ast,
		title,
		description,
	};
};
