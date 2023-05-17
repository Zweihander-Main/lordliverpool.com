import * as React from 'react';

import AppProvider from './src/contexts/AppContext';

export const wrapRoot = ({ element }) => <AppProvider>{element}</AppProvider>;
