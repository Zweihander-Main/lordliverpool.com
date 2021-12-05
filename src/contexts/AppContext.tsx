import React from 'react';
import { StorageProvider } from './StorageContext';

type AppContextProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppContextProps> = ({ children }) => {
	return <StorageProvider>{children}</StorageProvider>;
};

export default AppProvider;
