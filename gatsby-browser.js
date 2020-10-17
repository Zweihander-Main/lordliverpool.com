/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import 'typeface-libre-baskerville';
import 'typeface-cardo';

import React from 'react';

import { ModalProvider } from './src/contexts/ModalContext';
import { ChronologyProvider } from './src/contexts/ChronologyContext';

export const wrapRootElement = ({ element }) => (
	<ChronologyProvider>
		<ModalProvider>{element}</ModalProvider>
	</ChronologyProvider>
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
