describe('Visual snapshots', () => {
	beforeEach(() => {
		cy.viewport(1920, 1080);
	});
	it('match for the hero', () => {
		cy.visit('/').get('main');
		cy.loadImageByAltText(
			"Britain's Greatest Prime Minister: Lord Liverpool"
		);
		Cypress.browser.isHeadless
			? cy.matchImageSnapshot('hero')
			: cy.log('No screenshot taken when headed');
	});
});

export {};
