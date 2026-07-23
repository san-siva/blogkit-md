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

import { renderMarkdownAst } from './renderMarkdown';

const parse = (md: string): Root =>
	unified().use(remarkParse).use(remarkGfm).parse(md) as Root;

describe('renderMarkdownAst', () => {
	it('returns an empty sections array for empty markdown', () => {
		const result = renderMarkdownAst(parse(''));
		expect(result.sections).toHaveLength(0);
	});

	it('returns one section for single-section markdown', () => {
		const result = renderMarkdownAst(parse('## Section\n\nSome content'));
		expect(result.sections).toHaveLength(1);
	});

	it('returns multiple sections for multi-section markdown', () => {
		const result = renderMarkdownAst(parse('## One\n\n## Two\n\n## Three'));
		expect(result.sections).toHaveLength(3);
	});

	it('preserves the section title', () => {
		const result = renderMarkdownAst(parse('## Section\n\nSome content'));
		const section = result.sections[0] as React.ReactElement;
		const titleEl = section.props.title as React.ReactElement;
		expect(titleEl.type).toBe('p');
		expect(titleEl.props.children).toEqual(['Section']);
	});

	it('preserves titles of all sections when there are multiple sections', () => {
		const result = renderMarkdownAst(parse('## One\n\n## Two'));
		const titleEls = (result.sections as React.ReactElement[]).map(
			s => s.props.title as React.ReactElement
		);
		expect(titleEls[0].type).toBe('p');
		expect(titleEls[0].props.children).toEqual(['One']);
		expect(titleEls[1].type).toBe('p');
		expect(titleEls[1].props.children).toEqual(['Two']);
	});
});
