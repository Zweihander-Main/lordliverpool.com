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
