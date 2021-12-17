import { WindowLocation } from 'types';
import { STATE_KEY_PREFIX, BGPM_APP_STATE, DELIM } from './constants';

export type ReadState = {
	state: string;
	pos: number | null;
	id: string | null;
};

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
		Object.prototype.hasOwnProperty.call(parsedState, 'state') &&
		Object.prototype.hasOwnProperty.call(parsedState, 'pos') &&
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
		const locKey = this.getLocKey(location);
		const state = this.read(locKey);
		if (state && isStoredState(state)) {
			return state;
		} else {
			// Stored value is mangled, delete it
			this.delete(locKey);
		}
		return undefined;
	}

	saveState(
		location: WindowLocation,
		state: string,
		pos: number | null,
		id: string | null
	): void {
		const stateKey = this.getLocKey(location);
		const toStoreObject: ReadState = { state, pos, id };
		this.save(stateKey, toStoreObject);
	}

	private getLocKey(location: WindowLocation): string {
		const locationName = location.key || location.pathname;
		return `${STATE_KEY_PREFIX}${DELIM}${locationName}${DELIM}`;
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

	private save(key: string, state: ReadState): void {
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
