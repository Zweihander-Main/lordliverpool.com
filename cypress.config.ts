import { defineConfig } from 'cypress';

export default defineConfig({
	viewportWidth: 1500,
	viewportHeight: 800,
	retries: {
		runMode: 2,
		openMode: 0,
	},
	e2e: {
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.ts')(on, config);
		},
		baseUrl: 'http://localhost:8000/',
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
	},
});
