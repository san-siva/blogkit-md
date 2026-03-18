import React from 'react';

import type { PhrasingContent } from 'mdast';

import styles from '@san-siva/stylekit/styles/index.module.scss';

function escapeHtml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}

function toHtmlString(nodes: PhrasingContent[]): string {
	return nodes
		.map(node => {
			switch (node.type) {
				case 'text': {
					return escapeHtml(node.value);
				}
				case 'html': {
					return node.value;
				}
				case 'strong': {
					return `<strong>${toHtmlString(node.children)}</strong>`;
				}
				case 'emphasis': {
					return `<em>${toHtmlString(node.children)}</em>`;
				}
				case 'inlineCode': {
					return `<code>${escapeHtml(node.value)}</code>`;
				}
				case 'link': {
					return `<a href="${escapeHtml(node.url)}">${toHtmlString(node.children)}</a>`;
				}
				case 'break': {
					return '<br>';
				}
				case 'image': {
					return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt ?? '')}" style="max-width:300px">`;
				}
				default: {
					return '';
				}
			}
		})
		.join('');
}

export function renderPhrasingContent(
	nodes: PhrasingContent[]
): React.ReactNode {
	if (nodes.some(node => node.type === 'html')) {
		return <span dangerouslySetInnerHTML={{ __html: toHtmlString(nodes) }} />;
	}

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
					<a key={index} href={node.url} className={styles['a--highlighted']}>
						{renderPhrasingContent(node.children)}
					</a>
				);
			}
			case 'break': {
				return <br key={index} />;
			}
			case 'image': {
				return (
					<img
						key={index}
						src={node.url}
						alt={node.alt ?? ''}
						style={{ maxWidth: '300px' }}
					/>
				);
			}
			default: {
				return null;
			}
		}
	});
}
