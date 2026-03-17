import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import remarkParse from 'remark-parse';
import { unified } from 'unified';


const filePath = process.argv[2];

if (!filePath) {
	throw new Error('Usage: tsx src/index.ts <path-to-markdown-file>');
}

const markdownContent = readFileSync(filePath, 'utf8');

const processor = unified().use(remarkParse);
const ast = processor.parse(markdownContent);

const outputFileName = path.basename(filePath, path.extname(filePath)) + '.ast.json';
const outputPath = path.join(path.dirname(filePath), outputFileName);

writeFileSync(outputPath, JSON.stringify(ast, null, 2), 'utf8');

console.log(`AST written to ${outputPath}`);
