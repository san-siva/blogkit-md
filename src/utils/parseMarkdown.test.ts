import { describe, expect, it } from 'vitest';

import { parseMarkdown } from './parseMarkdown';

describe('parseMarkdown', () => {
	describe('consumeH1Title', () => {
		it('extracts a leading H1 as the title when no frontmatter title is set', () => {
			const { frontmatter, ast } = parseMarkdown('# My Title\n\nSome content');
			expect(frontmatter.title).toBe('My Title');
		});

		it('removes the H1 from the AST after extracting it as the title', () => {
			const { ast } = parseMarkdown('# My Title\n\nSome content');
			expect(ast.children[0]?.type).not.toBe('heading');
		});

		it('does not consume the H1 when frontmatter title is already set', () => {
			const { frontmatter, ast } = parseMarkdown('---\ntitle: Frontmatter Title\n---\n\n# H1 Title');
			expect(frontmatter.title).toBe('Frontmatter Title');
			expect(ast.children[0]?.type).toBe('heading');
		});

		it('does not extract a title when the first heading is not H1', () => {
			const { frontmatter } = parseMarkdown('## Section Title');
			expect(frontmatter.title).toBeUndefined();
		});

		it('does not extract a title when H1 is not the first node', () => {
			const { frontmatter, ast } = parseMarkdown('Some intro\n\n# Title');
			expect(frontmatter.title).toBeUndefined();
			expect(ast.children).toHaveLength(2);
		});

		it('handles inline formatting in the H1', () => {
			const { frontmatter } = parseMarkdown('# My **Bold** Title');
			expect(frontmatter.title).toBe('My Bold Title');
		});
	});
});
