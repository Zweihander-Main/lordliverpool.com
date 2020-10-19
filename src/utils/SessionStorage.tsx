import { Location } from 'history';
const STATE_KEY_PREFIX = `@@bgpm_appstate|`;
const BGPM_APP_STATE = `___BGPM_APP_STATE`;

const unavailbleMessage = `[BGPM--AppState] Unable to access sessionStorage; sessionStorage is not available.`;

interface ReadState {
	position: number | undefined;
	state: string | undefined;
}

export class SessionStorage {
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
		const storedValue = JSON.stringify({
			position,
			state,
		} as ReadState);

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
		const stateKeyBase = `${STATE_KEY_PREFIX}${locationKey}`;
		return key === null || typeof key === `undefined`
			? stateKeyBase
			: `${stateKeyBase}|${key}`;
	}
}
