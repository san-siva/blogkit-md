import React from 'react';

import type { PhrasingContent, Root, RootContent } from 'mdast';

import { BlogSection, CodeBlock } from '@san-siva/blogkit';

import styles from '@san-siva/stylekit/styles/index.module.scss';

import { renderPhrasingContent } from './renderPhrasingContent';
import { groupSections } from './groupSections';
import type { Section } from './groupSections';

function renderNode(
	node: RootContent,
	key: number,
	nextNode?: RootContent
): React.ReactNode {
	switch (node.type) {
		case 'paragraph': {
			const marginClass =
				nextNode?.type === 'paragraph'
					? styles['margin-bottom--1']
					: styles['margin-bottom--2'];
			return (
				<p key={key} className={marginClass}>
					{renderPhrasingContent(node.children)}
				</p>
			);
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

function renderNodes(nodes: RootContent[]): React.ReactNode[] {
	return nodes.map((node, index) => renderNode(node, index, nodes[index + 1]));
}

function renderSection(section: Section, key: number): React.ReactNode {
	return (
		<BlogSection key={key} title={section.title}>
			{renderNodes(section.nodes)}
			{section.subsections.map((subsection, index) =>
				renderSection(subsection, index)
			)}
		</BlogSection>
	);
}

export type RenderedMarkdown = {
	h1: string | null;
	beforeFirstHeading: React.ReactNode[];
	prelude: React.ReactNode[];
	sections: React.ReactNode[];
};

export const renderMarkdownAst = (ast: Root): RenderedMarkdown => {
	const { h1, beforeFirstHeading, prelude, sections } = groupSections(
		ast.children
	);

	return {
		h1,
		beforeFirstHeading: renderNodes(beforeFirstHeading),
		prelude: renderNodes(prelude),
		sections: sections.map((section, index) => renderSection(section, index)),
	};
};

export const MarkdownSections = ({
	rendered,
}: {
	rendered: RenderedMarkdown;
}): React.ReactNode => (
	<>
		{rendered.beforeFirstHeading.length > 0 && (
			<BlogSection>{rendered.beforeFirstHeading}</BlogSection>
		)}
		{rendered.prelude.length > 0 && (
			<BlogSection>{rendered.prelude}</BlogSection>
		)}
		{rendered.sections}
	</>
);
