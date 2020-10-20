import { WindowLocation } from '@reach/router';

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

export type AppLocState = {
	selectedCategory?: string;
	id?: string;
	initialPos?: number;
};

export type LocTyping = WindowLocation<AppLocState> & { action?: string };
