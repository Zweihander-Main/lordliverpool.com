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

// Either upperState+initialPos OR id
export type AppLocState = {
	upperState?: string;
	initialPos?: number;
	id?: string;
};
