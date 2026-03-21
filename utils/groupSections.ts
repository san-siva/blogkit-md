import type { RootContent } from 'mdast';

import { extractText } from './extractText';

export type Section = {
	title: string;
	headingLevel: number;
	nodes: RootContent[];
	subsections: Section[];
	previousSection?: Section;
};

const consumeNode = (
	nodes: RootContent[],
	index: number,
	sections: Section[],
	section: Section
): Section[] => {
	const node = nodes.at(index);
	if (!node) {
		return sections;
	}

	const isHeading = node.type === 'heading';
	if (!isHeading) {
		section.nodes.push(node);
		return consumeNode(nodes, index + 1, sections, section);
	}

	const headingLevel = node.depth;
	const isIncrementingHeading = headingLevel > section.headingLevel;
	if (isIncrementingHeading) {
		const subsection: Section = {
			title: extractText(node.children),
			headingLevel,
			nodes: [],
			subsections: [],
			previousSection: section,
		};
		section.subsections.push(subsection);
		return consumeNode(nodes, index + 1, sections, subsection);
	}

	if (!section.previousSection) {
		const subSection: Section = {
			title: extractText(node.children),
			headingLevel,
			nodes: [],
			subsections: [],
			previousSection: undefined,
		};
		sections.push(subSection);
		return consumeNode(nodes, index + 1, sections, subSection);
	}

	return consumeNode(nodes, index, sections, section.previousSection);
};

export const groupSections = (nodes: RootContent[]): Section[] => {
	const initialSection: Section = {
		title: '',
		headingLevel: Infinity,
		nodes: [],
		subsections: [],
		previousSection: undefined,
	};
	const sections: Section[] = [initialSection];
	consumeNode(nodes, 0, sections, initialSection);
	return sections.filter(s => s.title !== '' || s.nodes.length > 0);
};
