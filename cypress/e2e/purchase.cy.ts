describe('Purchase flow', () => {
	it('brings up list of valid options', () => {
		cy.visit('/').get('main');
		cy.findAllByLabelText(/^Bring up available retailers$/)
			.first()
			.click();
		cy.findByLabelText(/^amazon\.com$/i).as('amazon-link');
		cy.get('@amazon-link').should('be.visible');
		cy.get('@amazon-link').should((link) => {
			const href = link.attr('href');
			expect(href).to.include('https://www.amazon.com');
		});
	});
});
export {};
