import React, { createContext, useRef, useEffect, useCallback } from 'react';

type HistoryContextProps = {
	getLastNavigationFromBackButton(this: void): boolean;
};

const HistoryContext = createContext<HistoryContextProps>({
	getLastNavigationFromBackButton: () => false,
});

export default HistoryContext;

export const HistoryProvider: React.FC = ({ children }) => {
	const fromBackButton = useRef(false);

	const resetBackButton = useCallback(() => {
		fromBackButton.current = false;
	}, []);

	const historyListener = useCallback(() => {
		fromBackButton.current = true;
	}, []);

	useEffect(() => {
		window.addEventListener('popstate', historyListener);
		return () => {
			window.removeEventListener('popstate', historyListener);
		};
	}, [historyListener]);

	const getLastNavigationFromBackButton = useCallback(() => {
		const returnValue = fromBackButton.current;
		resetBackButton();
		return returnValue;
	}, [resetBackButton, fromBackButton]);

	return (
		<HistoryContext.Provider
			value={{
				getLastNavigationFromBackButton,
			}}
		>
			{children}
		</HistoryContext.Provider>
	);
};

export const { Consumer: HistoryConsumer } = HistoryContext;
