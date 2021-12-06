import React, { createContext, useRef, useEffect, useCallback } from 'react';

type HistoryContextProps = {
	fromBackButton: React.MutableRefObject<boolean>;
	resetBackButton: () => void;
};

const HistoryContext = createContext<HistoryContextProps>({
	fromBackButton: { current: false },
	resetBackButton: () => undefined,
});

export default HistoryContext;

export const HistoryProvider: React.FC = ({ children }) => {
	const fromBackButton = useRef(false);
	const resetBackButton = useCallback(() => {
		fromBackButton.current = false;
	}, []);

	useEffect(() => {
		const historyListener = () => {
			fromBackButton.current = false;
		};
		window.addEventListener('popstate', historyListener);
		return () => {
			window.removeEventListener('popstate', historyListener);
		};
	}, []);

	return (
		<HistoryContext.Provider
			value={{
				fromBackButton,
				resetBackButton,
			}}
		>
			{children}
		</HistoryContext.Provider>
	);
};

export const { Consumer: HistoryConsumer } = HistoryContext;
