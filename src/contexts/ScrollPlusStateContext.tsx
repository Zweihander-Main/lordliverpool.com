import React from 'react';
import { SessionStorage } from 'utils/SessionStorage';

const ScrollPlusStateContext = React.createContext<SessionStorage>(
	new SessionStorage()
);

export default ScrollPlusStateContext;

type ScrollPlusStateProviderProps = {
	children: React.ReactNode;
};

export const ScrollPlusStateProvider: React.FC<
	ScrollPlusStateProviderProps
> = ({ children }) => {
	const _stateStorage = SessionStorage.getInstance();

	return (
		<ScrollPlusStateContext.Provider value={_stateStorage}>
			{children}
		</ScrollPlusStateContext.Provider>
	);
};

export const { Consumer: ScrollPlusStateConsumer } = ScrollPlusStateContext;
