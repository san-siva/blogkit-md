import type { Metadata } from 'next';

import { BlogPost } from '@san-siva/blogkit-md';

import { BLOGKIT_MD, SITE_URL, generateMetadata } from './data';

export const metadata: Metadata = generateMetadata(BLOGKIT_MD);

export default function Home() {
	return (
		<BlogPost
			filePath="../README.md"
			jsonLd={{
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: BLOGKIT_MD.title,
				description: BLOGKIT_MD.desc,
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
