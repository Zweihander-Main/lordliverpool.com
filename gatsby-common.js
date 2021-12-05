import React from 'react';

import AppProvider from './src/contexts/AppContext';

// Note: Normally wraproot but need location context available
export const wrapPage = ({ element }) => <AppProvider>{element}</AppProvider>;
