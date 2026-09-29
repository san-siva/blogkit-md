import type { Metadata } from 'next';

import {
	Blog,
	BlogHeader,
	BlogSection,
	Callout,
	CodeBlock,
	Mermaid,
	Table,
} from '@san-siva/blogkit';

import { CODE_EXAMPLES } from './codeExamples';
import { BLOGKIT_MD, SITE_URL, buildPageMetadata } from './data';

const TITLE = 'blogkit-md';
const DESCRIPTION =
	'A React component library that converts markdown files into rendered blog posts for @san-siva/blogkit.';

export const metadata: Metadata = buildPageMetadata(TITLE, DESCRIPTION, BLOGKIT_MD);

const c = (text: string) => <code>{text}</code>;

export default function Home() {
	return (
		<Blog
			jsonLd={{
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: TITLE,
				description: DESCRIPTION,
				datePublished: BLOGKIT_MD.isoDate,
				author: {
					'@type': 'Person',
					name: 'Santhosh Siva',
					url: 'https://santhoshsiva.dev',
				},
				url: SITE_URL,
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'macOS, Linux, Windows',
			}}
		>
			<BlogHeader
				title={[TITLE]}
				desc={[
					'A React component library that converts markdown files into rendered blog posts for @san-siva/blogkit.',
				]}
			/>

			<BlogSection title="Overview">
				<p className="margin-bottom--2">
					A React component library that converts markdown files into rendered
					blog posts for{' '}
					<a href="https://blogkit.santhoshsiva.dev" target="_blank" rel="noopener noreferrer">
						<code>@san-siva/blogkit</code>
					</a>
					.
				</p>
			</BlogSection>

			<BlogSection title="Getting started">
				<p className="margin-bottom--2">
					<code>blogkit-md</code> exposes a <code>BlogPost</code> server component
					you can drop into any Next.js project.
				</p>

				<BlogSection title="Install">
					<CodeBlock hasMarginDown language="bash" code={CODE_EXAMPLES.installation} />
				</BlogSection>

				<BlogSection title="Usage">
					<CodeBlock hasMarginDown language="tsx" code={CODE_EXAMPLES.usage} />
				</BlogSection>

				<BlogSection title="Props">
					<Table
						hasMarginDown
						headers={['Prop', 'Type', 'Required', 'Description']}
						rows={[
							[
								c('filePath'),
								c('string'),
								'Yes',
								<p key="d">
									Path to the markdown file. Relative paths are resolved from{' '}
									<code>process.cwd()</code>.
								</p>,
							],
							[
								c('jsonLd'),
								c('WithContext<Thing>'),
								'No',
								<p key="d">
									Optional JSON-LD schema passed to <code>{'<Blog>'}</code> for
									structured data / SEO.
								</p>,
							],
						]}
					/>
				</BlogSection>

				<BlogSection title="Frontmatter">
					<p className="margin-bottom--2">
						Set the page title and description via a YAML frontmatter block at the
						top of your markdown file:
					</p>
					<CodeBlock hasMarginDown language="yaml" code={CODE_EXAMPLES.frontmatter} />
					<Table
						hasMarginDown
						headers={['Field', 'Description']}
						rows={[
							[
								c('title'),
								<p key="d">
									Renders as the <code>BlogHeader</code> page title
								</p>,
							],
							[
								c('description'),
								<p key="d">
									Renders as the <code>BlogHeader</code> description
								</p>,
							],
						]}
					/>
				</BlogSection>
			</BlogSection>

			<BlogSection title="Supported markdown features">
				<Table
					hasMarginDown
					headers={['Feature', 'Syntax']}
					rows={[
						['Frontmatter', <p key="s"><code>---</code> YAML block — sets <code>title</code>, <code>description</code></p>],
						['Section title', <p key="s"><code># H1</code> <code>## H2</code> — top-level section</p>],
						['Subsection title', <p key="s"><code>### H3</code> — nested section</p>],
						['Bold line', <p key="s"><code>#### H4</code> <code>##### H5</code> <code>###### H6</code></p>],
						['Paragraph', 'Plain text'],
						['Hard line break', 'Two spaces at end of line'],
						['Bold', c('**bold**')],
						['Italic', c('_italic_')],
						['Inline code', c('`code`')],
						['Link', c('[text](url)')],
						['Image', c('![alt](url)')],
						['Ordered list', c('1. item')],
						['Unordered list', c('- item')],
						['Task list', <p key="s"><code>- [ ] item</code> / <code>- [x] item</code></p>],
						['Table', <p key="s"><code>| col | col |</code> — headers and rows only</p>],
						['Code block', c('```lang')],
						['Mermaid diagram', c('```mermaid')],
						['Thematic break', c('---')],
						['Blockquote / Callout', <p key="s"><code>{'> text'}</code> or <code>{'> [!TYPE]'}</code> — renders as callout</p>],
					]}
				/>
			</BlogSection>

			<BlogSection title="Philosophy">
				<BlogSection title="Not Your Average Markdown Viewer">
					<p className="margin-bottom--2">
						If you&apos;re looking for a strictly standard, 1:1 markdown renderer,{' '}
						<code>blogkit-md</code> might not be what you expect.
					</p>
					<p className="margin-bottom--2">
						<mark>
							Instead of building just another plain document viewer, intentional
							design liberties have been taken to render markdown as{' '}
							<strong>beautiful, engaging blog posts</strong>.
						</mark>
					</p>
					<p className="margin-bottom--2">
						Documentation shouldn&apos;t be a wall of boring text. The goal of this
						tool is to make reading technical docs, articles, and guides an exciting
						and visually pleasing experience.
					</p>
				</BlogSection>

				<BlogSection title="Key Differences">
					<Table
						hasMarginDown
						headers={['', 'blogkit-md', 'Plain markdown renderer']}
						rows={[
							[<strong key="k">Output</strong>, 'Styled blog post', 'Raw document'],
							[<strong key="k">Typography</strong>, 'Optimized for long-form reading', 'Unstyled'],
							[
								<strong key="k">Ecosystem</strong>,
								<p key="v">
									Built for{' '}
									<a href="https://github.com/san-siva/blogkit" target="_blank" rel="noopener noreferrer">
										Blogkit
									</a>
								</p>,
								'Generic',
							],
						]}
					/>
				</BlogSection>
			</BlogSection>

			<BlogSection title="Architecture">
				<p className="margin-bottom--2">
					The markdown file is parsed into an AST using <code>remark-parse</code> +{' '}
					<code>remark-gfm</code>, then transformed into React components from{' '}
					<code>@san-siva/blogkit</code>.
				</p>
				<Mermaid id="architecture" code={CODE_EXAMPLES.architecture} hasMarginDown />
			</BlogSection>

			<BlogSection title="How Markdown Translates to Blog Sections">
				<BlogSection title="Headings as Layout Triggers">
					<p className="margin-bottom--2">
						In <code>blogkit-md</code>, headings aren&apos;t just for changing font
						sizes — <strong>they are the architectural blueprint for your post</strong>.
					</p>
					<Table
						hasMarginDown
						headers={['Markdown', 'Layout Behavior']}
						rows={[
							[
								<p key="m"><code># H1</code> &amp; <code>## H2</code></p>,
								<p key="b"><strong>Top-level section.</strong> Creates a new <code>BlogSection</code>.</p>,
							],
							[
								c('### H3'),
								<p key="b"><strong>Subsection.</strong> Nests within the active H1/H2 section. Promoted to top-level if none exists.</p>,
							],
							[
								<p key="m"><code>#### H4</code> <code>##### H5</code> <code>###### H6</code></p>,
								<p key="b"><strong>Bold line.</strong> Rendered as styled text inside the current section — no layout effect.</p>,
							],
						]}
					/>
					<Callout type="info" hasMarginDown>
						<p>
							Standard content — paragraphs, lists, code blocks — flows into the most
							recently opened section or subsection.
						</p>
					</Callout>
				</BlogSection>

				<BlogSection title="The Nesting Logic">
					<p className="margin-bottom--2">
						The layout is determined entirely by heading level (depth):
					</p>
					<ul className="margin-bottom--2">
						<li>
							<strong>Deeper heading (level up):</strong> If a heading has a higher
							number than the current one (e.g. <code>### H3</code> after{' '}
							<code>## H2</code>), it creates a nested subsection inside the current
							section.
						</li>
						<li>
							<strong>Equal or shallower heading (level down):</strong> If a heading
							has a number equal to or lower than the current one (e.g.{' '}
							<code>## H2</code> after another <code>## H2</code>), it closes the
							current section and starts a new one at the appropriate level.
						</li>
						<li>
							<strong>Initial content:</strong> Any content before the very first
							heading is grouped into an automatic untitled intro section.
						</li>
					</ul>
				</BlogSection>

				<BlogSection title="Visualizing the Structure">
					<p className="margin-bottom--2">
						Here is how a standard markdown document maps to blog layout:
					</p>
					<CodeBlock hasMarginDown language="markdown" code={CODE_EXAMPLES.structure} />
					<p className="margin-bottom--2">
						Here is how the parser breaks the above document down into isolated
						React components:
					</p>
					<p className="margin-bottom--2">
						<strong>Intro section</strong>
					</p>
					<CodeBlock hasMarginDown language="markdown" code={CODE_EXAMPLES.introSection} />
					<p className="margin-bottom--2">
						<strong>Section 1</strong>
					</p>
					<CodeBlock hasMarginDown language="markdown" code={CODE_EXAMPLES.section1} />
					<p className="margin-bottom--2">
						<strong>Section 2</strong>
					</p>
					<CodeBlock hasMarginDown language="markdown" code={CODE_EXAMPLES.section2} />
					<p className="margin-bottom--2">
						<strong>Section 3</strong>
					</p>
					<CodeBlock hasMarginDown language="markdown" code={CODE_EXAMPLES.section3} />
					<Callout type="info" hasMarginDown>
						<p>
							<code>## Also Nested</code> does not start a new top-level section.
							Because it appears after a <code>### H3</code> inside an{' '}
							<code># H1</code>, the parser backtracks to the H1 and nests the H2
							beneath it.
						</p>
					</Callout>
				</BlogSection>

				<BlogSection title="Callouts">
					<p className="margin-bottom--2">
						Blockquotes are rendered as styled callout banners. Plain blockquotes
						render as info callouts. Use GitHub-style alert syntax to control the
						type:
					</p>
					<Table
						hasMarginDown
						headers={['Syntax', 'Callout type']}
						rows={[
							[c('[!NOTE]'), 'info'],
							[c('[!TIP]'), 'info'],
							[c('[!IMPORTANT]'), 'info'],
							[c('[!WARNING]'), 'warning'],
							[c('[!CAUTION]'), 'error'],
						]}
					/>
					<CodeBlock hasMarginDown language="markdown" code={CODE_EXAMPLES.callout} />
					<p className="margin-bottom--2">
						The <code>[!TYPE]</code> line is stripped from the rendered output.
					</p>
				</BlogSection>
			</BlogSection>

			<BlogSection title="Want more customization?">
				<p className="margin-bottom--2">
					<code>blogkit-md</code> is just one piece of the puzzle. If you want to
					customize the underlying React components, tweak the UI, or take full
					control over your blog&apos;s layout, dive into the official{' '}
					<a href="https://blogkit.santhoshsiva.dev/" target="_blank" rel="noopener noreferrer">
						Blogkit documentation
					</a>
					.
				</p>

				<BlogSection title="License">
					<p className="margin-bottom--2">
						<code>blogkit-md</code> is open source software licensed under the{' '}
						<a
							href="https://github.com/san-siva/blogkit-md/blob/main/LICENSE"
							target="_blank"
							rel="noopener noreferrer"
						>
							MIT license
						</a>
						.
						<br />
						Contributions are welcome!
					</p>
				</BlogSection>

				<BlogSection title="About">
					<ul className="margin-bottom--2">
						<li>
							<strong>Author:</strong>{' '}
							<a href="https://www.santhoshsiva.dev" target="_blank" rel="noopener noreferrer">
								Santhosh Siva
							</a>
						</li>
						<li>
							<strong>License:</strong>{' '}
							<a
								href="https://github.com/san-siva/blogkit-md/blob/main/LICENSE"
								target="_blank"
								rel="noopener noreferrer"
							>
								MIT
							</a>
						</li>
					</ul>
				</BlogSection>
			</BlogSection>
		</Blog>
	);
}
