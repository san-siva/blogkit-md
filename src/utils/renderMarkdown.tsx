import React from 'react';

import {
	BlogSection,
	Callout,
	CheckList,
	type CheckListItem,
	CodeBlock,
	Mermaid,
	Table,
} from '@san-siva/blogkit';
import type { Root, RootContent } from 'mdast';

import type { Section } from './groupSections';
import { groupSections } from './groupSections';
import { renderPhrasingContent } from './renderPhrasingContent';

import styles from '@san-siva/stylekit/styles/index.module.scss';

type Counters = { mermaid: number };

function renderNode({
	node,
	key,
	nextNode,
	inList = false,
	inCallout = false,
	counters,
}: {
	node: RootContent;
	key: number;
	nextNode?: RootContent;
	inList?: boolean;
	inCallout?: boolean;
	counters: Counters;
}): React.ReactNode {
	switch (node.type) {
		case 'paragraph': {
			if (inList) {
				return <p key={key}>{renderPhrasingContent(node.children)}</p>;
			}

			const isFollowedByParagraph = nextNode?.type === 'paragraph';
			const isLastInCallout = !nextNode && inCallout;

			const marginClass = isFollowedByParagraph
				? styles['margin-bottom--1']
				: isLastInCallout
					? undefined
					: styles['margin-bottom--2'];

			return (
				<p key={key} className={marginClass}>
					{renderPhrasingContent(node.children)}
				</p>
			);
		}
		case 'code': {
			if (node.lang === 'mermaid') {
				const mermaidId = counters.mermaid++;
				return (
					<Mermaid
						key={key}
						id={`mermaid-${mermaidId}`}
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
					const githubAlertMatch =
						/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]$/i.exec(
							firstInline.value
						);
					if (githubAlertMatch) {
						const alertType = githubAlertMatch[1].toUpperCase();
						calloutType =
							alertType === 'WARNING'
								? 'warning'
								: alertType === 'CAUTION'
									? 'error'
									: 'info';
						strippedChildren = children.slice(1);
					}
				}
			}

			return (
				<Callout key={key} type={calloutType} hasMarginUp hasMarginDown>
					<div>
						{strippedChildren.map((child, index) =>
							renderNode({
								node: child,
								key: index,
								nextNode: strippedChildren[index + 1],
								inCallout: true,
								counters,
							})
						)}
					</div>
				</Callout>
			);
		}
		case 'list': {
			const isTaskList = node.children.every(
				item => item.checked !== null && item.checked !== undefined
			);
			if (isTaskList) {
				const items: CheckListItem[] = node.children.map((item, index) => ({
					id: String(index),
					isChecked: item.checked === true,
					children: item.children.map((child, childIndex) =>
						renderNode({
							node: child as RootContent,
							key: childIndex,
							inList: true,
							counters,
						})
					),
				}));
				return <CheckList key={key} items={items} hasMarginUp hasMarginDown />;
			}
			const Tag = node.ordered ? 'ol' : 'ul';
			return (
				<Tag key={key} className={styles['margin-bottom--2']}>
					{node.children.map((item, index) => (
						<li key={index}>
							{item.children.map((child, index) =>
								renderNode({
									node: child as RootContent,
									key: index,
									inList: true,
									counters,
								})
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

function renderNodes(
	nodes: RootContent[],
	counters: Counters
): React.ReactNode[] {
	return nodes.map((node, index) =>
		renderNode({ node, key: index, nextNode: nodes[index + 1], counters })
	);
}

function renderSection(
	section: Section,
	counters: Counters,
	key = -1
): React.ReactNode {
	return (
		<BlogSection key={key} title={section?.title ?? ''}>
			{renderNodes(section.nodes, counters)}
			{section.subsections.map((subsection, index) =>
				renderSection(subsection, counters, index)
			)}
		</BlogSection>
	);
}

export type RenderedMarkdown = {
	sections: React.ReactNode[];
};

export const renderMarkdownAst = (ast: Root): RenderedMarkdown => {
	const counters: Counters = { mermaid: 0 };
	const grouped = groupSections(ast.children);
	return {
		sections: grouped.map((section, index) =>
			renderSection(section, counters, index)
		),
	};
};

export const MarkdownSections = ({
	rendered,
}: {
	rendered: RenderedMarkdown;
}): React.ReactNode => <>{rendered.sections}</>;
