/// add this at the top of your test files 👆// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// cypress.commands.overwrite('visit', (originalfn, url, options) => { ... })
import axe from 'axe-core';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand({
	failureThreshold: 0.03, // threshold for entire image
	failureThresholdType: 'percent', // percent of image or number of pixels
	customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
	capture: 'viewport', // capture viewport in screenshot
});

Cypress.Commands.add('getSessionStorage', (key: string) => {
	cy.window().then((window) => window.sessionStorage.getItem(key));
});

Cypress.Commands.add('setSessionStorage', (key: string, value: string) => {
	cy.window().then((window) => {
		window.sessionStorage.setItem(key, value);
	});
});

Cypress.Commands.add(
	'visitAndSpyStorage',
	(url: string, func: string = 'setItem') => {
		cy.visit(url, {
			onBeforeLoad: (win) => {
				cy.spy(win.sessionStorage, func).as('sessStorFunc');
			},
		});
		cy.get('@sessStorFunc', { timeout: 10000 }).should('be.called');
	}
);

// Custom logging for axe
const terminalLog = (violations: axe.Result[]): void => {
	cy.task(
		'log',
		`${violations.length} accessibility violation${
			violations.length === 1 ? '' : 's'
		} ${violations.length === 1 ? 'was' : 'were'} detected`
	);
	// pluck specific keys to keep the table readable
	const violationData = violations.map(
		({ id, impact, description, nodes }) => ({
			id,
			impact,
			description,
			nodes: nodes.length,
		})
	);

	cy.task('table', violationData);
};

Cypress.Commands.add('checkA11yWithLog', (...args) => {
	const type = Cypress.env('type');
	return cy.checkA11y(
		args[0] || undefined,
		args[1] || undefined,
		type === 'cli' ? terminalLog : args[2] || undefined
	);
});
Cypress.Commands.add('verifyLocation', (path: string) => {
	cy.location().should((loc) => {
		expect(loc.pathname).to.be.oneOf([path, `${path}/`]);
	});
	cy.get('main');
});

Cypress.Commands.add('loadImageByAltText', (altText: string) => {
	cy.findByAltText(altText)
		.should('be.visible')
		.and(($img) => {
			expect($img[0].clientWidth).to.be.greaterThan(0);
		});
});

export {};
