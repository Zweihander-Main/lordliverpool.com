import React from 'react';
import { ModalProvider } from './ModalContext';
import { ChronologyProvider } from './ChronologyContext';

type AppContextProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppContextProps> = ({ children }) => {
	return (
		<ModalProvider>
			<ChronologyProvider>{children}</ChronologyProvider>
		</ModalProvider>
	);
};

export default AppProvider;
