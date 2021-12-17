export type NextPrevInfo = {
	slug: string;
	title: string;
} | null;

// pageContext of pages created in gatsby-node
export interface TemplatePageContext {
	id: string;
	prev: NextPrevInfo;
	next: NextPrevInfo;
}

export type ScrollLocReducerState = {
	[key: string]: {
		contextState: string;
		pos: number | null;
		id: string | null;
	};
};
