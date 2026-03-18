import { Blog, BlogHeader, Callout } from '@san-siva/blogkit';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Thing, WithContext } from 'schema-dts';

import { parseMarkdown } from '../utils/parseMarkdown';
import { MarkdownSections, renderMarkdownAst } from '../utils/renderMarkdown';

type BlogPostProperties = {
	filePath: string;
	jsonLd?: WithContext<Thing>;
};

const BlogPost = ({ filePath, jsonLd }: BlogPostProperties) => {
	const absolutePath = path.isAbsolute(filePath)
		? filePath
		: path.join(process.cwd(), filePath);

	let content: string;
	try {
		content = readFileSync(absolutePath, 'utf8');
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

	const ast = parseMarkdown(content);
	const rendered = renderMarkdownAst(ast);

	return (
		<Blog jsonLd={jsonLd}>
			{rendered.pageTitle && (
				<BlogHeader title={[rendered.pageTitle]} desc={[]} />
			)}
			<MarkdownSections rendered={rendered} />
		</Blog>
	);
};

export default BlogPost;
