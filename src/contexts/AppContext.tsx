import React from 'react';
import { StorageProvider } from './StorageContext';
import { ScrollLocProvider } from './ScrollLocContext';
import { HistoryProvider } from './HistoryContext';

const AppProvider: React.FC = ({ children }) => {
	return (
		<HistoryProvider>
			<StorageProvider>
				<ScrollLocProvider>{children}</ScrollLocProvider>
			</StorageProvider>
		</HistoryProvider>
	);
};

export default AppProvider;
