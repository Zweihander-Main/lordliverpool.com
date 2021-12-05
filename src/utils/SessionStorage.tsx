import { Location } from 'history';
import { STATE_KEY_PREFIX, BGPM_APP_STATE, DELIM } from './constants';

const unavailbleMessage =
	'[BGPM--AppState] Unable to access sessionStorage; sessionStorage is not available.';

export type ReadState = {
	position: number;
	state: string;
};

export class SessionStorage {
	private static instance: SessionStorage;

	static getInstance(): SessionStorage {
		if (!SessionStorage.instance) {
			SessionStorage.instance = new SessionStorage();
		}
		return SessionStorage.instance;
	}

	read(location: Location, key: string): ReadState | undefined {
		const stateKey = this.getStateKey(location, key);

		try {
			const value = window.sessionStorage.getItem(stateKey);
			return value ? JSON.parse(value) : undefined;
		} catch (e) {
			if (process.env.NODE_ENV !== `production`) {
				console.warn(unavailbleMessage);
			}

			if (
				window &&
				window[BGPM_APP_STATE] &&
				window[BGPM_APP_STATE][stateKey]
			) {
				return window[BGPM_APP_STATE][stateKey];
			}

			return undefined;
		}
	}

	save(
		location: Location,
		key: string,
		position: number,
		state: string
	): void {
		const stateKey = this.getStateKey(location, key);
		const toStoreObject: ReadState = { position, state };
		const storedValue = JSON.stringify(toStoreObject);

		try {
			window.sessionStorage.setItem(stateKey, storedValue);
		} catch (e) {
			if (window && window[BGPM_APP_STATE]) {
				window[BGPM_APP_STATE][stateKey] = JSON.parse(storedValue);
			} else {
				window[BGPM_APP_STATE] = {};
				window[BGPM_APP_STATE][stateKey] = JSON.parse(storedValue);
			}

			if (process.env.NODE_ENV !== `production`) {
				console.warn(unavailbleMessage);
			}
		}
	}

	getStateKey(location: Location, key: string): string {
		const locationKey = location.key || location.pathname;
		const stateKeyBase = `${STATE_KEY_PREFIX}${DELIM}${locationKey}`;
		return key === null || typeof key === 'undefined'
			? stateKeyBase
			: `${stateKeyBase}${DELIM}${key}`;
	}
}
