import { WindowLocation } from 'types';
import { STATE_KEY_PREFIX, BGPM_APP_STATE, DELIM } from './constants';

export type ReadState = {
	position: number;
	state: string;
};

export type ReadId = {
	id: string;
};

type LocKeyType = 'ID' | 'STATE';

const appStateInWindow = (): Record<string, unknown> | undefined => {
	if (window && window[BGPM_APP_STATE]) {
		const appStateObj: unknown = window[BGPM_APP_STATE];
		if (typeof appStateObj === 'object' && appStateObj !== null) {
			return appStateObj as Record<string, unknown>;
		}
	}
	return undefined;
};

const isStoredState = (parsedState: unknown): parsedState is ReadState => {
	if (
		parsedState &&
		typeof parsedState === 'object' &&
		parsedState !== null &&
		Object.prototype.hasOwnProperty.call(parsedState, 'position') &&
		Object.prototype.hasOwnProperty.call(parsedState, 'state')
	) {
		return true;
	}
	return false;
};

const isStoredId = (parsedState: unknown): parsedState is ReadId => {
	if (
		parsedState &&
		typeof parsedState === 'object' &&
		parsedState !== null &&
		Object.prototype.hasOwnProperty.call(parsedState, 'id')
	) {
		return true;
	}
	return false;
};
export class SessionStorage {
	private static instance: SessionStorage;

	static getInstance(): SessionStorage {
		if (!SessionStorage.instance) {
			SessionStorage.instance = new SessionStorage();
		}
		return SessionStorage.instance;
	}

	readState(location: WindowLocation): ReadState | undefined {
		const locKey = this.getLocKey(location, 'STATE');
		const position = this.read(locKey);
		if (position && isStoredState(position)) {
			return position;
		} else {
			// Stored value is mangled, delete it
			this.delete(locKey);
		}
		return undefined;
	}

	readId(location: WindowLocation): ReadId | undefined {
		const locKey = this.getLocKey(location, 'ID');
		const id = this.read(locKey);
		if (id && isStoredId(id)) {
			return id;
		} else {
			// Stored value is mangled, delete it
			this.delete(locKey);
		}
		return undefined;
	}

	saveState(location: WindowLocation, position: number, state: string): void {
		const stateKey = this.getLocKey(location, 'STATE');
		const toStoreObject: ReadState = { position, state };
		this.save(stateKey, toStoreObject);
	}

	saveId(location: WindowLocation, id: string): void {
		const locKey = this.getLocKey(location, 'ID');
		const toStoreObject: ReadId = { id };
		this.save(locKey, toStoreObject);
	}

	private getLocKey(location: WindowLocation, type: LocKeyType): string {
		const locationName = location.key || location.pathname;
		return `${STATE_KEY_PREFIX}${DELIM}${locationName}${DELIM}${type}`;
	}

	private read(key: string): unknown | undefined {
		try {
			const value = window.sessionStorage.getItem(key);
			return value ? JSON.parse(value) : undefined;
		} catch (e) {
			const appState = appStateInWindow();
			if (appState && appState[key]) {
				return appState[key];
			}
			return undefined;
		}
	}

	private save(key: string, state: ReadState | ReadId): void {
		const storedValue = JSON.stringify(state);

		try {
			window.sessionStorage.setItem(key, storedValue);
		} catch (e) {
			const appState = appStateInWindow();
			const parsedValue: unknown = JSON.parse(storedValue);
			if (appState) {
				appState[key] = parsedValue;
			} else {
				window[BGPM_APP_STATE] = {};
				const newAppState = appStateInWindow();
				if (newAppState) {
					newAppState[key] = parsedValue;
				}
			}
		}
	}

	private delete(key: string): void {
		try {
			window.sessionStorage.removeItem(key);
		} catch (e) {
			const appState = appStateInWindow();
			if (appState && appState[key]) {
				delete appState[key];
			}
		}
	}
}
