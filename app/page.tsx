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

	const { rendered } = result;

	return (
		<Blog>
			{rendered.pageTitle && <BlogHeader title={[rendered.pageTitle]} desc={[]} />}
			<MarkdownSections rendered={rendered} />
		</Blog>
	);
};

export default Page;
