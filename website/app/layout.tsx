import type { Metadata } from 'next';
import { JetBrains_Mono, Montserrat, Rubik } from 'next/font/google';

import '@san-siva/blogkit/styles.css';
import '@san-siva/stylekit/styles/globals.scss';
import styles from '@san-siva/stylekit/styles/index.module.scss';

import { SITE_URL } from './data';

const montserrat = Montserrat({
	subsets: ['latin'] as const,
	weight: ['400', '500', '600', '700', '800'] as const,
	style: ['normal', 'italic'] as const,
	variable: '--font-montserrat',
});

const rubik = Rubik({
	subsets: ['latin'] as const,
	weight: ['300', '400', '500', '600', '700', '800', '900'] as const,
	style: ['normal', 'italic'] as const,
	variable: '--font-rubik',
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'] as const,
	weight: ['400', '500', '600', '700'] as const,
	style: ['normal', 'italic'] as const,
	variable: '--font-jetbrains-mono',
});

const TITLE = 'blogkit-md — Markdown to Blog';
const DESCRIPTION =
	'A Next.js tool that converts standard markdown files into rendered blog posts for Blogkit.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	keywords: [
		'markdown',
		'blog',
		'next.js',
		'blogkit',
		'react',
		'mdast',
		'remark',
	],
	authors: [{ name: 'Santhosh Siva' }],
	alternates: {
		canonical: `${SITE_URL}/`,
	},
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		type: 'website',
		url: `${SITE_URL}/`,
	},
	twitter: {
		card: 'summary_large_image',
		title: TITLE,
		description: DESCRIPTION,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body
				className={`${montserrat.variable} ${rubik.variable} ${jetbrainsMono.variable}`}
			>
				<div className={styles.page}>{children}</div>
			</body>
		</html>
	);
}
