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

const makeSection = (
	title: string,
	nodes: Section['nodes'] = [],
	subsections: Section[] = []
): Section => ({
	title,
	headingLevel: 2,
	nodes,
	subsections,
});

const parse = (md: string): Root =>
	unified().use(remarkParse).use(remarkGfm).parse(md) as Root;

describe('stripRedundantSectionTitle', () => {
	it('clears the section title when isTitleEmpty is false and the section has nodes', () => {
		const grouped = [makeSection('My Title', [{ type: 'paragraph', children: [] }])];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].title).toBe('');
	});

	it('clears the section title when isTitleEmpty is false and the section has subsections', () => {
		const sub = makeSection('Sub', [{ type: 'paragraph', children: [] }]);
		const grouped = [makeSection('My Title', [], [sub])];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].title).toBe('');
	});

	it('does not clear the title when isTitleEmpty is true', () => {
		const grouped = [makeSection('My Title', [{ type: 'paragraph', children: [] }])];
		stripRedundantSectionTitle(grouped, true);
		expect(grouped[0].title).toBe('My Title');
	});

	it('does not clear the title when there are multiple sections', () => {
		const grouped = [
			makeSection('Title A', [{ type: 'paragraph', children: [] }]),
			makeSection('Title B', [{ type: 'paragraph', children: [] }]),
		];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].title).toBe('Title A');
		expect(grouped[1].title).toBe('Title B');
	});

	it('does not clear the title when the section has no nodes or subsections', () => {
		const grouped = [makeSection('My Title')];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].title).toBe('My Title');
	});

	it('does not clear the title when it is already empty', () => {
		const grouped = [makeSection('', [{ type: 'paragraph', children: [] }])];
		stripRedundantSectionTitle(grouped, false);
		expect(grouped[0].title).toBe('');
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
		expect(section.props.title).toBe('Section');
	});

	it('preserves titles of all sections when there are multiple sections', () => {
		const result = renderMarkdownAst(parse('## One\n\n## Two'), false);
		const titles = (result.sections as React.ReactElement[]).map(s => s.props.title);
		expect(titles).toEqual(['One', 'Two']);
	});
});
