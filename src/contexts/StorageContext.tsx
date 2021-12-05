import React, { createContext } from 'react';
import { SessionStorage, ReadState } from 'utils/SessionStorage';
import { useLocation } from '@reach/router';
import { LocTyping } from 'types';

type StorageContextProps = {
	loadSavedState: () => ReadState | undefined;
	saveState: (position: number, state: string) => void;
};

const StorageContext = createContext<StorageContextProps>({
	loadSavedState: () => undefined,
	saveState: () => undefined,
});

export default StorageContext;

export const StorageProvider: React.FC = ({ children }) => {
	const storage = SessionStorage.getInstance();
	const location = useLocation() as LocTyping;

	const loadSavedState = () => {
		return storage.readState(location);
	};

	const saveState = (position: number, state: string) => {
		storage.saveState(location, position, state);
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
