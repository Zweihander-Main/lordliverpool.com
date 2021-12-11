/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react';
import { wrapRoot } from './gatsby-common';

export const wrapRootElement = wrapRoot;

/**
 *
 * @param {*} props
 * @param {string} location string without slashes of location
 */
const isLocation = (props, location) => {
	const pathname = props.routerProps.location.pathname;
	if (
		pathname.endsWith(`/${location}`) ||
		pathname.endsWith(`/${location}/`)
	) {
		return true;
	}
	return false;
};

export const shouldUpdateScroll = (props) => {
	if (isLocation(props, 'chronology') || isLocation(props, 'contenders')) {
		return false;
	}
	return true;
};

export const onClientEntry = () => {
	if (process.env.NODE_ENV !== 'development') {
		const whyDidYouRender = require('@welldone-software/why-did-you-render');
		whyDidYouRender(React, {
			trackAllPureComponents: true,
			trackHooks: true,
			include: [/.*/],
			exclude: [
				/^DevOverlay$/,
				/^ErrorBoundary$/,
				/^Link$/,
				/^GatsbyLink$/,
				/^GatsbyLinkLocationWrapper$/,
				/^Location$/,
				/^RouteAnnouncer$/,
				/^Unknown$/,
				/^[A-Z]$/,
				/^Placeholder$/,
				/^MainImage$/,
				/^Picture$/,
				/^StaticQueryStore$/,
			],
			collapseGroups: true,
		});
	}
};
