import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'export',
	trailingSlash: true,
	transpilePackages: ['@san-siva/blogkit-md'],
	turbopack: {
		root: path.join(__dirname, '..', '..'),
	},
};

export default nextConfig;
