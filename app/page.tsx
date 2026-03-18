import { Blog, BlogHeader, Callout } from '@san-siva/blogkit';

import { useMarkdownFile } from '@/hooks/useMarkdownFile';
import { MarkdownSections } from '@/utils/renderMarkdown';

const Page = () => {
	const result = useMarkdownFile(process.env.MARKDOWN_FILE);

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
