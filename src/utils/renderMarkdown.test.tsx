import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { Root } from 'mdast';

vi.mock('@san-siva/stylekit/styles/index.module.scss', () => ({ default: {} }));
vi.mock('@san-siva/blogkit', () => ({
	BlogSection: 'BlogSection',
	Callout: 'Callout',
	CheckList: 'CheckList',
	CodeBlock: 'CodeBlock',
	Mermaid: 'Mermaid',
	Table: 'Table',
}));

import { renderMarkdownAst, stripRedundantSectionTitle } from './renderMarkdown';
import type { Section } from './groupSections';
import type { PhrasingContent } from 'mdast';

const textNode = (value: string): PhrasingContent => ({ type: 'text', value });

const makeSection = (
	titleNodes: PhrasingContent[] = [],
	nodes: Section['nodes'] = [],
	subsections: Section[] = []
): Section => ({
	titleNodes,
	headingLevel: 2,
	nodes,
	subsections,
});

const parse = (md: string): Root =>
	unified().use(remarkParse).use(remarkGfm).parse(md) as Root;

describe('stripRedundantSectionTitle', () => {
	it('clears titleNodes when isTitleEmpty is false and the section has nodes', () => {
		const grouped = [makeSection([textNode('My Title')], [{ type: 'paragraph', children: [] }])];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].titleNodes).toHaveLength(0);
	});

	it('clears titleNodes when isTitleEmpty is false and the section has subsections', () => {
		const sub = makeSection([textNode('Sub')], [{ type: 'paragraph', children: [] }]);
		const grouped = [makeSection([textNode('My Title')], [], [sub])];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].titleNodes).toHaveLength(0);
	});

	it('does not clear titleNodes when isTitleEmpty is true', () => {
		const grouped = [makeSection([textNode('My Title')], [{ type: 'paragraph', children: [] }])];
		stripRedundantSectionTitle(grouped, true);
		expect(grouped[0].titleNodes).toEqual([textNode('My Title')]);
	});

	it('does not clear titleNodes when there are multiple sections', () => {
		const grouped = [
			makeSection([textNode('Title A')], [{ type: 'paragraph', children: [] }]),
			makeSection([textNode('Title B')], [{ type: 'paragraph', children: [] }]),
		];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].titleNodes).toEqual([textNode('Title A')]);
		expect(grouped[1].titleNodes).toEqual([textNode('Title B')]);
	});

	it('does not clear titleNodes when the section has no nodes or subsections', () => {
		const grouped = [makeSection([textNode('My Title')])];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].titleNodes).toEqual([textNode('My Title')]);
	});

	it('does not clear titleNodes when they are already empty', () => {
		const grouped = [makeSection([], [{ type: 'paragraph', children: [] }])];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].titleNodes).toHaveLength(0);
	});
});

describe('renderMarkdownAst', () => {
	it('returns an empty sections array for empty markdown', () => {
		const result = renderMarkdownAst(parse(''), false);
		expect(result.sections).toHaveLength(0);
	});

	it('returns one section for single-section markdown', () => {
		const result = renderMarkdownAst(parse('## Section\n\nSome content'), false);
		expect(result.sections).toHaveLength(1);
	});

	it('returns multiple sections for multi-section markdown', () => {
		const result = renderMarkdownAst(parse('## One\n\n## Two\n\n## Three'), false);
		expect(result.sections).toHaveLength(3);
	});

	it('strips the section title when isTitleEmpty is false and there is a single titled section', () => {
		const result = renderMarkdownAst(parse('## Section\n\nSome content'), false);
		const section = result.sections[0] as React.ReactElement;
		expect(section.props.title).toBe('');
	});

	it('preserves the section title when isTitleEmpty is true', () => {
		const result = renderMarkdownAst(parse('## Section\n\nSome content'), true);
		const section = result.sections[0] as React.ReactElement;
		const titleEl = section.props.title as React.ReactElement;
		expect(titleEl.type).toBe('p');
		expect(titleEl.props.children).toEqual(['Section']);
	});

	it('preserves titles of all sections when there are multiple sections', () => {
		const result = renderMarkdownAst(parse('## One\n\n## Two'), false);
		const titleEls = (result.sections as React.ReactElement[]).map(
			s => s.props.title as React.ReactElement
		);
		expect(titleEls[0].type).toBe('p');
		expect(titleEls[0].props.children).toEqual(['One']);
		expect(titleEls[1].type).toBe('p');
		expect(titleEls[1].props.children).toEqual(['Two']);
	});
});
