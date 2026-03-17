import type { PhrasingContent } from 'mdast';

export const extractText = (nodes: PhrasingContent[]): string =>
	nodes
		.map(node => {
			if (node.type === 'text') return node.value;
			if ('children' in node)
				return extractText(node.children as PhrasingContent[]);
			return '';
		})
		.join('');
