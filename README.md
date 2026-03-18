# blogkit-md

A Next.js tool that converts standard markdown files into rendered blog posts for [`@san-siva/blogkit`](https://blogkit.santhoshsiva.dev).

## How it works

The markdown file is parsed into an AST using `remark-parse`, then transformed into React components from `@san-siva/blogkit`. Heading levels map to blog structure:

| Heading | Role |
|---------|------|
| `# H1` | Page title |
| `## H2` | Blog section |
| `### H3` | Subsection (nested inside the current H2 section) |
| `#### H4` | Bold line (`<p><strong>`) — causes the next H3 to become a new top-level section |

## Getting started

```bash
npm install
```

### Dev server

```bash
npm run dev                          # uses data/test.md by default
npm run dev -- --file=data/my-post.md  # specify a markdown file
```

The dev server watches the markdown file for changes and auto-reloads the browser via HMR.

### Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint   # check
npm run fix    # auto-fix
```

## Supported markdown features

- Headings (H1–H4)
- Paragraphs, hard line breaks (`  ` at end of line)
- **Bold**, _italic_, `inline code`
- Links
- Images
- Ordered and unordered lists
- Fenced code blocks (with syntax highlighting)
- Mermaid diagrams (` ```mermaid `)
- Thematic breaks (`---`)
