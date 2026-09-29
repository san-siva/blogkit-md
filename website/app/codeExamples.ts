const installation = `npm install @san-siva/blogkit-md`;

const usage = `import { BlogPost } from '@san-siva/blogkit-md';

export default function Page() {
	return (
		<BlogPost
			filePath="content/my-post.md"
			jsonLd={{
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				headline: 'My Post',
				description: 'Post description',
				datePublished: '2026-01-01',
				author: { '@type': 'Person', name: 'Your Name' },
			}}
		/>
	);
}`;

const frontmatter = `---
title: My Post Title
description: A short description shown below the title
---`;

const architecture = `flowchart LR
    A[Markdown file] --> B[Parse AST]
    B --> C[Group sections]
    C --> D[Render to React]
    D --> E[Blog page]`;

const structure = `Intro content

## The Setup

Some content goes here.

### Prerequisites

Nested content belongs here.

## The Execution

Some more content.

### The Results

Result content.

# A Note

### A Subsection

## Also Nested`;

const introSection = `Intro content`;

const section1 = `## The Setup

Some content goes here.

### Prerequisites

Nested content belongs here.`;

const section2 = `## The Execution

Some more content.

### The Results

Result content.`;

const section3 = `# A Note

### A Subsection

## Also Nested`;

const callout = `> [!WARNING]
>
> Do not clone this repository into system folders.`;

export const CODE_EXAMPLES = {
	installation,
	usage,
	frontmatter,
	architecture,
	structure,
	introSection,
	section1,
	section2,
	section3,
	callout,
};
