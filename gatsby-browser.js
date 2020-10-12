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

export const wrapRootElement = ({ element }) => (
	<ModalProvider>{element}</ModalProvider>
);
