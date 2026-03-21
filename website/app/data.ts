export const SITE_URL = 'https://blogkit-md.santhoshsiva.dev';

export type PageMeta = {
	publishedOn: string;
	isoDate: string;
	keywords: string[];
};

export const buildPageMetadata = (title: string, description: string, meta: PageMeta) => ({
	title,
	description,
	keywords: meta.keywords,
	authors: [{ name: 'Santhosh Siva' }],
	alternates: {
		canonical: `${SITE_URL}/`,
	},
	openGraph: {
		title,
		description,
		type: 'website' as const,
		url: `${SITE_URL}/`,
	},
	twitter: {
		card: 'summary_large_image' as const,
		title,
		description,
	},
});

export const BLOGKIT_MD: PageMeta = {
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
