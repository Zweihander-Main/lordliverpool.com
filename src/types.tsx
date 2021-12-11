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

export type WindowLocation = Window['location'] & {
	key?: string | undefined;
};

export type HistoryWithKey = {
	state?: {
		key?: string;
	};
};
