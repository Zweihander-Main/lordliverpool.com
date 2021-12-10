import React from 'react';
import { StorageProvider } from './StorageContext';
import { ScrollStateProvider } from './ScrollStateContext';

type AppContextProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppContextProps> = ({ children }) => {
	return (
		<StorageProvider>
			<ScrollStateProvider>{children}</ScrollStateProvider>
		</StorageProvider>
	);
};

export default AppProvider;
