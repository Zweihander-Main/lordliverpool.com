const STATE_KEY_PREFIX = `@@bgpm_appstate|`;
const BGPM_APP_STATE = `___BGPM_APP_STATE`;

const unavailbleMessage = `[BGPM--AppState] Unable to access sessionStorage; sessionStorage is not available.`;

export class SessionStorage {
	read(key: string): string | undefined {
		const stateKey = this.getStateKey(key);

		try {
			const value = window.sessionStorage.getItem(stateKey);
			return value ? JSON.parse(value) : 0;
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

	save(key: string, value: string): void {
		const stateKey = this.getStateKey(key);
		const storedValue = JSON.stringify(value);

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

	getStateKey(key: string): string {
		return `${STATE_KEY_PREFIX}${key}`;
	}
}
