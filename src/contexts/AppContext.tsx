import React from 'react';
import { StorageProvider } from './StorageContext';
import { HistoryProvider } from './HistoryContext';

type AppContextProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppContextProps> = ({ children }) => {
	return (
		<StorageProvider>
			<HistoryProvider>{children}</HistoryProvider>
		</StorageProvider>
	);
};

export default AppProvider;
