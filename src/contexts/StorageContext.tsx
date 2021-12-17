import React, { createContext } from 'react';
import { HistoryWithKey, WindowLocation } from 'types';
import { SessionStorage, ReadState } from 'utils/SessionStorage';

type StorageContextProps = {
	loadSavedState: () => ReadState | undefined;
	saveState: (state: string, pos: number | null, id: string | null) => void;
};

const StorageContext = createContext<StorageContextProps>({
	loadSavedState: () => undefined,
	saveState: () => undefined,
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

	const saveState = (
		state: string,
		pos: number | null,
		id: string | null
	) => {
		storage.saveState(createLocation(), state, pos, id);
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
