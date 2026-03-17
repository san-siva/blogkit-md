import { Blog, BlogHeader } from '@san-siva/blogkit';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { MarkdownSections, renderMarkdownAst } from '@/lib/markdownRenderer';

const Page = () => {
	const markdownContent = readFileSync(
		path.join(process.cwd(), 'data/test.md'),
		'utf8'
	);

	const processor = unified().use(remarkParse);
	const ast = processor.parse(markdownContent);
	const rendered = renderMarkdownAst(ast);

	return (
		<Blog>
			{rendered.h1 && (
				<BlogHeader
					title={[rendered.h1]}
					desc={rendered.description ? [rendered.description] : ['']}
				/>
			)}
			<MarkdownSections rendered={rendered} />
		</Blog>
	);
};

export default Page;
