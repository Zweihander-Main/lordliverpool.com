describe('Visual snapshots', () => {
	it('match for the hero', () => {
		cy.visit('/').get('main'); // TODO refactor this across the board and on other site
		cy.loadImageByAltText(
			"Britain's Greatest Prime Minister: Lord Liverpool"
		);
		cy.matchImageSnapshot('hero');
	});
});

export {};
