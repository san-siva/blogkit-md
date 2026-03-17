# Blogkit MD

Blogkit MD is a simple, lightweight, translator, that converts standard markdown files into JSX blog posts.
Blogkit MD needs to generate JSX files to be used with [Blogkit](https://blogkit.santhoshsiva.dev).

## Task

Create a typescript script, that converts a markdown file into a AST file.

See the example below:

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';

const markdownFileContent = `
# Welcome to Blogkit
This is a paragraph with some **bold** text and a [link](https://santhoshsiva.dev).
`;

// 1. Initialize the unified processor with the remark parser
const processor = unified().use(remarkParse);

// 2. Parse the markdown string to get the AST (mdast)
const ast = processor.parse(markdownFileContent);

// 3. Inspect the AST
console.dir(ast, { depth: null });
```

In order to achieve this, I need your help, configuring this typescript project.
With eslint and prettier setup. Refer /Users/santhosh.siva/Documents/Personal/portfolio_website/santhosh.siva.dev/worktrees/develop for inspiration
