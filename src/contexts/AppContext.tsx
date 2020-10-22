import React from 'react';
import { ScrollPlusStateProvider } from './ScrollPlusStateContext';

type AppContextProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppContextProps> = ({ children }) => {
	return <ScrollPlusStateProvider>{children}</ScrollPlusStateProvider>;
};

export default AppProvider;
