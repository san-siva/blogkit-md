import React from 'react';

import type { PhrasingContent } from 'mdast';

export function renderPhrasingContent(
	nodes: PhrasingContent[]
): React.ReactNode {
	return nodes.map((node, index) => {
		switch (node.type) {
			case 'text': {
				return node.value;
			}
			case 'strong': {
				return (
					<strong key={index}>{renderPhrasingContent(node.children)}</strong>
				);
			}
			case 'emphasis': {
				return <em key={index}>{renderPhrasingContent(node.children)}</em>;
			}
			case 'inlineCode': {
				return <code key={index}>{node.value}</code>;
			}
			case 'link': {
				return (
					<a key={index} href={node.url}>
						{renderPhrasingContent(node.children)}
					</a>
				);
			}
			default: {
				return null;
			}
		}
	});
}
