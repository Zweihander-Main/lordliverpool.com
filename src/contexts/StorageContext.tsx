import React, { createContext } from 'react';
import { HistoryWithKey, WindowLocation } from 'types';
import { SessionStorage, ReadState, ReadId } from 'utils/SessionStorage';

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

// TODO perf callback/ect.
export const StorageProvider: React.FC = ({ children }) => {
	const storage = SessionStorage.getInstance();

	const createLocation = (): WindowLocation => ({
		...window.location,
		key: (history as HistoryWithKey)?.state?.key || undefined,
	});

	const loadSavedState = () => {
		return storage.readState(createLocation());
	};

	const loadSavedId = () => {
		return storage.readId(createLocation());
	};

	const saveState = (position: number, state: string) => {
		storage.saveState(createLocation(), position, state);
	};

	const saveId = (id: string) => {
		storage.saveId(createLocation(), id);
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
