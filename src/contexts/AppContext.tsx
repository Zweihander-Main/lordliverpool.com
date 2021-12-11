import React from 'react';
import { StorageProvider } from './StorageContext';
import { ScrollLocProvider } from './ScrollLocContext';
import { HistoryProvider } from './HistoryContext';

type AppContextProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppContextProps> = ({ children }) => {
	return (
		<HistoryProvider>
			<StorageProvider>
				<ScrollLocProvider>{children}</ScrollLocProvider>
			</StorageProvider>
		</HistoryProvider>
	);
};

export default AppProvider;
