import { Blog, BlogHeader, Callout } from '@san-siva/blogkit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Thing, WithContext } from 'schema-dts';

import { parseMarkdown } from '../utils/parseMarkdown';
import { MarkdownSections, renderMarkdownAst } from '../utils/renderMarkdown';

type BlogPostProperties = {
	filePath: string;
	jsonLd?: WithContext<Thing>;
};

const BlogPost = async ({ filePath, jsonLd }: BlogPostProperties) => {
	const absolutePath = path.isAbsolute(filePath)
		? filePath
		: path.join(process.cwd(), filePath);

	let content: string;
	try {
		content = await readFile(absolutePath, 'utf8');
	} catch {
		return (
			<Blog>
				<Callout type="warning">
					Could not read file: &quot;{filePath}&quot;. Make sure the path is
					correct and the file exists.
				</Callout>
			</Blog>
		);
	}

	if (!content.trim()) {
		return (
			<Blog>
				<Callout type="warning">File &quot;{filePath}&quot; is empty.</Callout>
			</Blog>
		);
	}

	const { ast, frontmatter } = parseMarkdown(content);
	const rendered = renderMarkdownAst(ast);

	const title = frontmatter.title ?? rendered.pageTitle;
	const desc = frontmatter.description;

	return (
		<Blog jsonLd={jsonLd}>
			{title && (
				<BlogHeader title={[title]} desc={desc ? [desc] : []} />
			)}
			<MarkdownSections rendered={rendered} />
		</Blog>
	);
};

export default BlogPost;
