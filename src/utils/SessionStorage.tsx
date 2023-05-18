import { STATE_KEY_PREFIX, BGPM_APP_STATE } from './constants';
import { ScrollLocReducerState } from '../types';
declare global {
	interface Window {
		[BGPM_APP_STATE]: Record<string, unknown>;
	}
}

const appStateInWindow = (): Record<string, unknown> | undefined => {
	if (window && window[BGPM_APP_STATE]) {
		const appStateObj: unknown = window[BGPM_APP_STATE];
		if (typeof appStateObj === 'object' && appStateObj !== null) {
			return appStateObj as Record<string, unknown>;
		}
	}
	return undefined;
};

const isStoredState = (
	parsedState: unknown
): parsedState is ScrollLocReducerState => {
	if (
		parsedState &&
		typeof parsedState === 'object' &&
		parsedState !== null &&
		Object.keys(parsedState).every(
			(track) =>
				Object.prototype.hasOwnProperty.call(
					(parsedState as Record<string, unknown>)[track],
					'contextState'
				) &&
				Object.prototype.hasOwnProperty.call(
					(parsedState as Record<string, unknown>)[track],
					'pos'
				) &&
				Object.prototype.hasOwnProperty.call(
					(parsedState as Record<string, unknown>)[track],
					'id'
				)
		)
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

	readState(): ScrollLocReducerState | undefined {
		const locKey = this.getLocKey();
		const state = this.read(locKey);
		if (state && isStoredState(state)) {
			return state;
		} else {
			// Stored value is mangled, delete it
			this.delete(locKey);
		}
		return undefined;
	}

	saveState(state: ScrollLocReducerState): void {
		const stateKey = this.getLocKey();
		this.save(stateKey, state);
	}

	private getLocKey(): string {
		return `${STATE_KEY_PREFIX}`;
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

	private save(key: string, state: ScrollLocReducerState): void {
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
