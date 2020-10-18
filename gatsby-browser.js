/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react';

import AppProvider from './src/contexts/AppContext';

export const wrapRootElement = ({ element }) => (
	<AppProvider>{element}</AppProvider>
);

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
