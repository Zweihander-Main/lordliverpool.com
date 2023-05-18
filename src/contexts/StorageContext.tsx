import React, { ReactNode, createContext } from 'react';
import { SessionStorage } from '../utils/SessionStorage';
import { ScrollLocReducerState } from '../types';

type StorageContextProps = {
	loadSavedState: () => ScrollLocReducerState | undefined;
	saveState: (state: ScrollLocReducerState) => void;
};

const StorageContext = createContext<StorageContextProps>({
	loadSavedState: () => undefined,
	saveState: () => undefined,
});

export default StorageContext;

// TODO perf callback/ect.
export const StorageProvider: React.FC<{ children?: ReactNode }> = ({
	children,
}) => {
	const storage = SessionStorage.getInstance();

	const loadSavedState = () => {
		return storage.readState();
	};

	const saveState = (state: ScrollLocReducerState) => {
		storage.saveState(state);
	};

	return (
		<StorageContext.Provider
			value={{
				loadSavedState,
				saveState,
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};

export const { Consumer: StorageConsumer } = StorageContext;
