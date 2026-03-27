import type { PhrasingContent, RootContent } from 'mdast';

export type Section = {
	titleNodes: PhrasingContent[];
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
		// If a section has content nodes before a deeper heading, wrap those
		// nodes in an untitled subsection so they aren't lost.
		// e.g. ## Parent > "intro text" > ### Child
		// becomes: Parent { subsections: [{ title: '', nodes: [...] }, Child] }
		// instead of: Parent { nodes: [...], subsections: [Child] }
		if (section.nodes.length > 0) {
			const subSection: Section = {
				titleNodes: [],
				headingLevel: section.headingLevel,
				nodes: section.nodes,
				subsections: [],
				previousSection: section,
			};
			section.subsections.push(subSection);
			section.nodes = [];
		}
		const subsection: Section = {
			titleNodes: node.children,
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
			titleNodes: node.children,
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
		titleNodes: [],
		headingLevel: Infinity,
		nodes: [],
		subsections: [],
		previousSection: undefined,
	};
	const sections: Section[] = [initialSection];
	consumeNode(nodes, 0, sections, initialSection);
	return sections.filter(s => s.titleNodes.length > 0 || s.nodes.length > 0);
};
