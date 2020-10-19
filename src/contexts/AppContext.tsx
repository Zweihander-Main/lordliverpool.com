import React from 'react';
import { ModalProvider } from './ModalContext';
import { ScrollPlusStateProvider } from './ScrollPlusStateContext';

type AppContextProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppContextProps> = ({ children }) => {
	return (
		<ModalProvider>
			<ScrollPlusStateProvider>{children}</ScrollPlusStateProvider>
		</ModalProvider>
	);
};

export default AppProvider;
