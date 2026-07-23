import { describe, expect, it } from 'vitest';

import { parseMarkdown } from './parseMarkdown';

describe('parseMarkdown', () => {
	describe('consumeH1Title', () => {
		it('extracts a leading H1 as the title when no frontmatter title is set', () => {
			const { title } = parseMarkdown('# My Title\n\nSome content');
			expect(title).toBe('My Title');
		});

		it('removes the H1 from the AST after extracting it as the title', () => {
			const { ast } = parseMarkdown('# My Title\n\nSome content');
			expect(ast.children[0]?.type).not.toBe('heading');
		});

		it('does not consume the H1 when frontmatter title is already set', () => {
			const { title, ast } = parseMarkdown('---\ntitle: Frontmatter Title\n---\n\n# H1 Title');
			expect(title).toBe('Frontmatter Title');
			expect(ast.children[0]?.type).toBe('heading');
		});

		it('does not extract a title when the first heading is not H1', () => {
			const { title } = parseMarkdown('## Section Title');
			expect(title).toBeUndefined();
		});

		it('does not extract a title when H1 is not the first node', () => {
			const { title, ast } = parseMarkdown('Some intro\n\n# Title');
			expect(title).toBeUndefined();
			expect(ast.children).toHaveLength(2);
		});

		it('handles inline formatting in the H1', () => {
			const { title } = parseMarkdown('# My **Bold** Title');
			expect(title).toBe('My Bold Title');
		});
	});
});
