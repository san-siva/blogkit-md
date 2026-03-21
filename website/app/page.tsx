import type { Metadata } from 'next';

import { BlogPost, readMarkdownFile } from '@san-siva/blogkit-md';

import { BLOGKIT_MD, SITE_URL, buildPageMetadata } from './data';

const FILE_PATH = '../README.md';

export async function generateMetadata(): Promise<Metadata> {
	const result = await readMarkdownFile(FILE_PATH);
	if (!result.success) return {};

	const { title = '', description = '' } = result.frontmatter;
	return buildPageMetadata(title, description, BLOGKIT_MD);
}

export default async function Home() {
	const result = await readMarkdownFile(FILE_PATH);
	const title = result.success ? (result.frontmatter.title ?? '') : '';
	const description = result.success ? (result.frontmatter.description ?? '') : '';

	return (
		<BlogPost
			filePath={FILE_PATH}
			jsonLd={{
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: title,
				description,
				datePublished: BLOGKIT_MD.isoDate,
				author: {
					'@type': 'Person',
					name: 'Santhosh Siva',
					url: 'https://santhoshsiva.dev',
				},
				url: SITE_URL,
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'macOS, Linux, Windows',
			}}
		/>
	);
}
