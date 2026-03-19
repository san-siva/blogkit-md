import React from 'react';

import {
	BlogSection,
	Callout,
	CodeBlock,
	Mermaid,
	Table,
} from '@san-siva/blogkit';
import type { Root, RootContent } from 'mdast';

import type { Section } from './groupSections';
import { groupSections } from './groupSections';
import { renderPhrasingContent } from './renderPhrasingContent';

import styles from '@san-siva/stylekit/styles/index.module.scss';

function renderNode(
	node: RootContent,
	key: number,
	nextNode?: RootContent,
	inList = false
): React.ReactNode {
	switch (node.type) {
		case 'paragraph': {
			if (inList) {
				return <p key={key}>{renderPhrasingContent(node.children)}</p>;
			}
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
			if (node.lang === 'mermaid') {
				return (
					<Mermaid
						key={key}
						id={`mermaid-${key}`}
						code={node.value}
						hasMarginUp
						hasMarginDown
					/>
				);
			}
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
			return (
				<p key={key} className={styles['margin-bottom--2']}>
					<strong>{renderPhrasingContent(node.children)}</strong>
				</p>
			);
		}
		case 'thematicBreak': {
			return <hr key={key} className={styles['margin-bottom--2']} />;
		}
		case 'table': {
			const [headerRow, ...bodyRows] = node.children;
			const headers = headerRow?.children.map(cell =>
				renderPhrasingContent(cell.children)
			);
			const rows = bodyRows.map(row =>
				row.children.map((cell, index) => (
					<p key={index}>{renderPhrasingContent(cell.children)}</p>
				))
			);
			return (
				<Table
					key={key}
					headers={headers}
					rows={rows}
					hasMarginUp
					hasMarginDown
				/>
			);
		}
		case 'blockquote': {
			const children = node.children as RootContent[];
			let calloutType: 'info' | 'warning' | 'error' = 'info';
			let strippedChildren = children;

			const firstChild = children[0];
			if (firstChild?.type === 'paragraph') {
				const firstInline = firstChild.children[0];
				if (firstInline?.type === 'text') {
					if (firstInline.value.startsWith('!')) {
						calloutType = 'error';
						const trimmed = firstInline.value.slice(1).trimStart();
						strippedChildren = [
							{
								...firstChild,
								children: [
									{ ...firstInline, value: trimmed },
									...firstChild.children.slice(1),
								],
							},
							...children.slice(1),
						];
					} else if (firstInline.value.startsWith('~')) {
						calloutType = 'warning';
						const trimmed = firstInline.value.slice(1).trimStart();
						strippedChildren = [
							{
								...firstChild,
								children: [
									{ ...firstInline, value: trimmed },
									...firstChild.children.slice(1),
								],
							},
							...children.slice(1),
						];
					}
				}
			}

			return (
				<Callout key={key} type={calloutType} hasMarginUp hasMarginDown>
					{strippedChildren.map((child, index) =>
						renderNode(child, index, strippedChildren[index + 1])
					)}
				</Callout>
			);
		}
		case 'list': {
			const Tag = node.ordered ? 'ol' : 'ul';
			return (
				<Tag key={key} className={styles['margin-bottom--2']}>
					{node.children.map((item, index) => (
						<li key={index}>
							{item.children.map((child, index) =>
								renderNode(child as RootContent, index, undefined, true)
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
	pageTitle: string | null;
	beforeFirstHeading: React.ReactNode[];
	textBeforeFirstSection: React.ReactNode[];
	sections: React.ReactNode[];
};

export const renderMarkdownAst = (ast: Root): RenderedMarkdown => {
	const { pageTitle, beforeFirstHeading, textBeforeFirstSection, sections } =
		groupSections(ast.children);

	return {
		pageTitle,
		beforeFirstHeading: renderNodes(beforeFirstHeading),
		textBeforeFirstSection: renderNodes(textBeforeFirstSection),
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
		{rendered.textBeforeFirstSection.length > 0 && (
			<BlogSection>{rendered.textBeforeFirstSection}</BlogSection>
		)}
		{rendered.sections}
	</>
);
