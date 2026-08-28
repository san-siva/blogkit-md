import { Blog, BlogHeader, Callout } from '@san-siva/blogkit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Thing, WithContext } from 'schema-dts';

import { parseMarkdown } from '../utils/parseMarkdown';
import { MarkdownSections, renderMarkdownAst } from '../utils/renderMarkdown';

type BlogPostProperties = {
	filePath: string;
	jsonLd?: WithContext<Thing>;
	increasedWidthMode?: boolean;
};

const BlogPost = async ({
	filePath,
	jsonLd,
	increasedWidthMode,
}: BlogPostProperties) => {
	const absolutePath = path.isAbsolute(filePath)
		? filePath
		: path.join(process.cwd(), filePath);

	let content: string;
	try {
		content = await readFile(absolutePath, 'utf8');
	} catch {
		return (
			<Blog increasedWidthMode={increasedWidthMode}>
				<Callout type="warning">
					<p>
						Could not read file: &quot;{filePath}&quot;. Make sure the path is
						correct and the file exists.
					</p>
				</Callout>
			</Blog>
		);
	}

	if (!content.trim()) {
		return (
			<Blog increasedWidthMode={increasedWidthMode}>
				<Callout type="warning">File &quot;{filePath}&quot; is empty.</Callout>
			</Blog>
		);
	}

	const { ast, title, description: desc } = parseMarkdown(content);

	const rendered = renderMarkdownAst(ast);

	return (
		<Blog jsonLd={jsonLd} increasedWidthMode={increasedWidthMode}>
			{title && <BlogHeader title={[title]} desc={desc ? [desc] : []} />}
			<MarkdownSections rendered={rendered} />
		</Blog>
	);
};

export default BlogPost;
