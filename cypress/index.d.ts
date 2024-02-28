/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
declare namespace Cypress {
	interface Chainable {
		/**
		 * Custom command to get session storage value
		 * @example cy.getSessionStorage('id')
		 */
		getSessionStorage(value: string): void;
		/**
		 * Custom command to set session storage value
		 * @example cy.getSessionStorage('id', 'sample')
		 */
		setSessionStorage(key: string, value: string): void;
		/**
		 * Custom visit that also spies on session storage
		 * @example cy.waitForSessionStorage('/', 'setItem')
		 */
		visitAndSpyStorage(url: string, func?: string): void;
		/**
		 * Cypress-axe checkA11y with custom console logging
		 * @example cy.checkA11yWithLog()
		 */
		checkA11yWithLog(
			context?: string | Node | axe.ContextObject | undefined,
			options?: Options | undefined,
			violationCallback?: ((violations: axe.Result[]) => void) | undefined
		): void;
		/**
		 * Verify location has caused navigation change
		 * @example cy.verifyLocation('/path')
		 */
		verifyLocation(path: string): void;
		/**
		 * Wait for image to load, find by alt text, useful for Gatsby
		 * @example cy.loadImageByAltText('Alt Text')
		 */
		loadImageByAltText(altText: string): void;
	}
}
