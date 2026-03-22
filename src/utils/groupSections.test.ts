import { describe, expect, it } from 'vitest';

import { parseMarkdown } from './parseMarkdown';
import { groupSections } from './groupSections';

const sections = (md: string) => groupSections(parseMarkdown(md).ast.children);

describe('groupSections', () => {
	describe('empty input', () => {
		it('returns an empty array', () => {
			expect(sections('')).toHaveLength(0);
		});
	});

	describe('content with no headings', () => {
		it('returns a single untitled section containing all nodes', () => {
			const result = sections('some text\n\nmore text');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('');
			expect(result[0].nodes).toHaveLength(2);
		});
	});

	describe('top-level sections', () => {
		it('creates a section for H1', () => {
			const result = sections('# Title');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('Title');
			expect(result[0].headingLevel).toBe(1);
		});

		it('creates a section for H2', () => {
			const result = sections('## Section');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('Section');
			expect(result[0].headingLevel).toBe(2);
		});

		it('creates multiple sections for sequential H2s', () => {
			const result = sections('## One\n\n## Two\n\n## Three');
			expect(result).toHaveLength(3);
			expect(result.map(s => s.title)).toEqual(['One', 'Two', 'Three']);
		});

		it('groups content nodes under their section', () => {
			const result = sections('## Section\n\nsome text\n\nmore text');
			expect(result).toHaveLength(1);
			expect(result[0].nodes).toHaveLength(2);
		});
	});

	describe('intro content before headings', () => {
		it('returns an untitled intro section followed by headed sections', () => {
			const result = sections('intro text\n\n## Section');
			expect(result).toHaveLength(2);
			expect(result[0].title).toBe('');
			expect(result[0].nodes).toHaveLength(1);
			expect(result[1].title).toBe('Section');
		});
	});

	describe('content before a deeper heading', () => {
		it('moves content preceding a subsection into its own untitled subsection', () => {
			const result = sections('## Parent\n\nsome text\n\n### Child');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('Parent');
			expect(result[0].nodes).toHaveLength(0);
			expect(result[0].subsections).toHaveLength(2);
			expect(result[0].subsections[0].title).toBe('');
			expect(result[0].subsections[0].nodes).toHaveLength(1);
			expect(result[0].subsections[1].title).toBe('Child');
		});

		it('skips the untitled subsection when no content precedes the deeper heading', () => {
			const result = sections('## Parent\n\n### Child');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('Parent');
			expect(result[0].subsections).toHaveLength(1);
			expect(result[0].subsections[0].title).toBe('Child');
		});
	});

	describe('nested sections (H3)', () => {
		it('nests H3 under a preceding H2', () => {
			const result = sections('## Parent\n\n### Child');
			expect(result).toHaveLength(1);
			expect(result[0].subsections).toHaveLength(1);
			expect(result[0].subsections[0].title).toBe('Child');
		});

		it('promotes H3 to top-level when no parent section exists', () => {
			const result = sections('### Orphan');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('Orphan');
		});

		it('creates multiple subsections under one parent', () => {
			const result = sections('## Parent\n\n### A\n\n### B');
			expect(result).toHaveLength(1);
			expect(result[0].subsections.map(s => s.title)).toEqual(['A', 'B']);
		});
	});

	describe('deeper headings (H4+)', () => {
		it('nests H4 as a subsection of H2', () => {
			const result = sections('## Section\n\n#### Note');
			expect(result[0].subsections).toHaveLength(1);
			expect(result[0].subsections[0].headingLevel).toBe(4);
		});

		it('nests H6 inside H5 inside H2', () => {
			const result = sections('## Section\n\n##### Five\n\n###### Six');
			const h5 = result[0].subsections[0];
			expect(h5.headingLevel).toBe(5);
			expect(h5.subsections[0].headingLevel).toBe(6);
		});
	});
});
