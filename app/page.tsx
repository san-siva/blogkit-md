import { Blog, BlogHeader, Callout } from '@san-siva/blogkit';

import { readMarkdownFile } from '@/hooks/readMarkdownFile';
import { MarkdownSections } from '@/utils/renderMarkdown';

const Page = async () => {
	const result = await readMarkdownFile(process.env.MARKDOWN_FILE);

	if (!result.success) {
		return (
			<Blog>
				<Callout type="warning">{result.error}</Callout>
			</Blog>
		);
	}

	const { rendered, frontmatter } = result;

	return (
		<Blog>
			{frontmatter.title && (
				<BlogHeader
					title={[frontmatter.title]}
					desc={frontmatter.description ? [frontmatter.description] : []}
				/>
			)}
			<MarkdownSections rendered={rendered} />
		</Blog>
	);
};

export default Page;
