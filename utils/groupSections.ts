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

export const groupSections = (nodes: RootContent[]): GroupedSections => {
	let pageTitle: string | null = null;
	const beforeFirstHeading: RootContent[] = [];
	const textBeforeFirstSection: RootContent[] = [];
	const sections: Section[] = [];
	let currentSection: Section | null = null;
	let currentSubsection: Section | null = null;
	let seenFirstHeading = false;
	let afterH1 = false;

	for (const node of nodes) {
		if (node.type === 'heading') {
			seenFirstHeading = true;

			switch (node.depth) {
			case 1: {
				pageTitle = extractText(node.children);
				afterH1 = true;
			
			break;
			}
			case 2: {
				currentSubsection = null;
				currentSection = {
					title: extractText(node.children),
					nodes: [],
					subsections: [],
				};
				sections.push(currentSection);
				afterH1 = false;
			
			break;
			}
			case 3: {
				currentSubsection = {
					title: extractText(node.children),
					nodes: [],
					subsections: [],
				};
				currentSection?.subsections.push(currentSubsection);
			
			break;
			}
			// No default
			}
		} else if (!seenFirstHeading) {
			beforeFirstHeading.push(node);
		} else if (currentSubsection) {
			currentSubsection.nodes.push(node);
		} else if (currentSection) {
			currentSection.nodes.push(node);
		} else if (afterH1) {
			textBeforeFirstSection.push(node);
		}
	}

	return { pageTitle, beforeFirstHeading, textBeforeFirstSection, sections };
};
