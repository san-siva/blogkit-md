import { BlogSection, CodeBlock } from '@san-siva/blogkit';
import type { PhrasingContent,Root, RootContent } from 'mdast';

export function extractText(nodes: PhrasingContent[]): string {
	return nodes
		.map(node => {
			if (node.type === 'text') return node.value;
			if ('children' in node)
				return extractText(node.children as PhrasingContent[]);
			return '';
		})
		.join('');
}

function renderPhrasingContent(nodes: PhrasingContent[]): React.ReactNode {
	return nodes.map((node, index) => {
		switch (node.type) {
			case 'text': {
				return node.value;
			}
			case 'strong': {
				return <strong key={index}>{renderPhrasingContent(node.children)}</strong>;
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

function renderNode(node: RootContent, key: number): React.ReactNode {
	switch (node.type) {
		case 'paragraph': {
			return <p key={key}>{renderPhrasingContent(node.children)}</p>;
		}

		case 'code': {
			return (
				<CodeBlock
					key={key}
					language={node.lang ?? 'text'}
					code={node.value}
					hasMarginUp
					hasMarginDown
				/>
			);
		}

		case 'heading': {
			const text = extractText(node.children);
			if (node.depth === 3) return <h3 key={key}>{text}</h3>;
			if (node.depth === 4) return <h4 key={key}>{text}</h4>;
			if (node.depth === 5) return <h5 key={key}>{text}</h5>;
			return null;
		}

		case 'list': {
			const Tag = node.ordered ? 'ol' : 'ul';
			return (
				<Tag key={key}>
					{node.children.map((item, index) => (
						<li key={index}>
							{item.children.map((child, index) =>
								renderNode(child as RootContent, index)
							)}
						</li>
					))}
				</Tag>
			);
		}

		default: {
			return null;
		}
	}
}

type Section = {
	title: string;
	nodes: RootContent[];
};

function groupIntoSections(nodes: RootContent[]): {
	h1: string | null;
	description: string | null;
	sections: Section[];
} {
	let h1: string | null = null;
	let description: string | null = null;
	const sections: Section[] = [];
	let currentSection: Section | null = null;
	let afterH1 = false;

	for (const node of nodes) {
		if (node.type === 'heading' && node.depth === 1) {
			h1 = extractText(node.children);
			afterH1 = true;
		} else if (node.type === 'heading' && node.depth === 2) {
			currentSection = { title: extractText(node.children), nodes: [] };
			sections.push(currentSection);
			afterH1 = false;
		} else if (currentSection) {
			currentSection.nodes.push(node);
		} else if (afterH1 && node.type === 'paragraph' && !description) {
			description = extractText(node.children);
		}
	}

	return { h1, description, sections };
}

export type RenderedMarkdown = {
	h1: string | null;
	description: string | null;
	sections: { title: string; content: React.ReactNode[] }[];
};

export function renderMarkdownAst(ast: Root): RenderedMarkdown {
	const { h1, description, sections } = groupIntoSections(ast.children);

	return {
		h1,
		description,
		sections: sections.map(section => ({
			title: section.title,
			content: section.nodes.map((node, index) => renderNode(node, index)),
		})),
	};
}

export const MarkdownSections = ({
	rendered,
}: {
	rendered: RenderedMarkdown;
}): React.ReactNode =>
	rendered.sections.map((section, index) => (
		<BlogSection key={index} title={section.title}>
			{section.content}
		</BlogSection>
	));
