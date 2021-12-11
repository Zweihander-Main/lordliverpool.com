import React, { createContext } from 'react';
import { SessionStorage, ReadState, ReadId } from 'utils/SessionStorage';
import { useLocation } from '@reach/router';
import { LocTyping } from 'types';

type StorageContextProps = {
	loadSavedState: () => ReadState | undefined;
	loadSavedId: () => ReadId | undefined;
	saveState: (position: number, state: string) => void;
	saveId: (id: string) => void;
};

const StorageContext = createContext<StorageContextProps>({
	loadSavedState: () => undefined,
	loadSavedId: () => undefined,
	saveState: () => undefined,
	saveId: () => undefined,
});

export default StorageContext;

//TODO way to not rely on router?
export const StorageProvider: React.FC = ({ children }) => {
	const storage = SessionStorage.getInstance();
	const location = useLocation() as LocTyping;

	const loadSavedState = () => {
		return storage.readState(location);
	};

	const loadSavedId = () => {
		return storage.readId(location);
	};

	const saveState = (position: number, state: string) => {
		storage.saveState(location, position, state);
	};

	const saveId = (id: string) => {
		storage.saveId(location, id);
	};

	return (
		<StorageContext.Provider
			value={{
				loadSavedState,
				loadSavedId,
				saveState,
				saveId,
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};

export const { Consumer: StorageConsumer } = StorageContext;
