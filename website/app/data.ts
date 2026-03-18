export const SITE_URL = 'https://blogkit-md.santhoshsiva.dev';

export type PageMeta = {
	title: string;
	desc: string;
	publishedOn: string;
	isoDate: string;
	keywords: string[];
};

export const generateMetadata = (meta: PageMeta) => ({
	title: meta.title,
	description: meta.desc,
	keywords: meta.keywords,
	authors: [{ name: 'Santhosh Siva' }],
	alternates: {
		canonical: `${SITE_URL}/`,
	},
	openGraph: {
		title: meta.title,
		description: meta.desc,
		type: 'website' as const,
		url: `${SITE_URL}/`,
	},
	twitter: {
		card: 'summary_large_image' as const,
		title: meta.title,
		description: meta.desc,
	},
});

export const BLOGKIT_MD: PageMeta = {
	title: 'blogkit-md — Markdown to Blog',
	desc: 'A Next.js tool that converts standard markdown files into rendered blog posts for Blogkit.',
	publishedOn: 'March 18, 2026',
	isoDate: '2026-03-18',
	keywords: [
		'markdown',
		'blog',
		'next.js',
		'blogkit',
		'react',
		'remark',
		'mdast',
	],
};
