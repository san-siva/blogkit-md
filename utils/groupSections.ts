import type { RootContent } from 'mdast';

import { extractText } from './extractText';

export type Section = {
	title: string;
	nodes: RootContent[];
	subsections: Section[];
};

export type GroupedSections = {
	pageTitle: string | null;
	beforeFirstHeading: RootContent[];
	textBeforeFirstSection: RootContent[];
	sections: Section[];
};

const makeSection = (title: string): Section => ({
	title,
	nodes: [],
	subsections: [],
});

// Closes over `sections` (const array — mutation only, CFA-safe).
// Callers assign the return value to `currentSection` directly in the
// outer scope so TypeScript's CFA can track the narrowing correctly.
const addSection = (title: string, sections: Section[]): Section => {
	const section = makeSection(title);
	sections.push(section);
	return section;
};

export const groupSections = (nodes: RootContent[]): GroupedSections => {
	let pageTitle: string | null = null;
	const beforeFirstHeading: RootContent[] = [];
	const textBeforeFirstSection: RootContent[] = [];
	const sections: Section[] = [];
	let currentSection: Section | null = null;
	let currentSubsection: Section | null = null;
	let seenFirstHeading = false;
	let afterH1 = false;
	let seenH4InCurrentSection = false;

	for (const node of nodes) {
		if (node.type === 'heading') {
			seenFirstHeading = true;

			switch (node.depth) {
				case 1: {
					if (sections.length === 0) {
						pageTitle = extractText(node.children);
						afterH1 = true;
					} else {
						currentSubsection = null;
						seenH4InCurrentSection = false;
						currentSection = addSection(extractText(node.children), sections);
					}
					break;
				}
				case 2: {
					currentSubsection = null;
					seenH4InCurrentSection = false;
					currentSection = addSection(extractText(node.children), sections);
					afterH1 = false;
					break;
				}
				case 3: {
					if (seenH4InCurrentSection || !currentSection) {
						currentSubsection = null;
						seenH4InCurrentSection = false;
						currentSection = addSection(extractText(node.children), sections);
					} else {
						currentSubsection = makeSection(extractText(node.children));
						currentSection.subsections.push(currentSubsection);
					}
					break;
				}
				case 4: {
					seenH4InCurrentSection = true;
					(currentSubsection ?? currentSection)?.nodes.push(node);
					break;
				}
				case 5:
				case 6: {
					(currentSubsection ?? currentSection)?.nodes.push(node);
					break;
				}
				// No default
			}
			continue;
		}

		if (!seenFirstHeading) {
			beforeFirstHeading.push(node);
			continue;
		}

		if (currentSubsection) {
			currentSubsection.nodes.push(node);
			continue;
		}

		if (currentSection) {
			currentSection.nodes.push(node);
			continue;
		}

		if (afterH1) {
			textBeforeFirstSection.push(node);
		}
	}

	return { pageTitle, beforeFirstHeading, textBeforeFirstSection, sections };
};
