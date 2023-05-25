describe('Scripts are still working in builds', () => {
	beforeEach(() => {
		cy.viewport(1920, 1080);
	});
	it('when navigating pages', () => {
		cy.visit('/').get('main');
		cy.findByText('Menu').click();
		cy.findByText('Contenders').click();
	});
	it('when hovering over contenders', () => {
		cy.visit('/contenders').get('main');
		cy.loadImageByAltText('Sir Robert Walpole');
		cy.findByText(/^Theresa May$/).as('theresa');
		cy.findByTestId('caption')
			.as('caption')
			.should('have.text', 'Sir Robert Walpole');
		cy.get('@theresa').trigger('mouseover');
		cy.get('@caption').should('have.text', 'Theresa May');
	});
});

export {};
