describe('Scroll state', () => {
	beforeEach(() => {});

	const contendersSetup = () => {
		cy.visit('/contenders').get('main');
		cy.findByText(/^Theresa May$/).as('theresa');
		cy.findByTestId('caption')
			.as('caption')
			.should('have.text', 'Sir Robert Walpole');
		cy.get('@theresa').click();
		cy.location().should((loc) => {
			expect(loc.href).to.include('theresa-may');
		});
	};

	const contendersVerify = () => {
		cy.findByTestId('caption').should('have.text', 'Theresa May');
	};

	it('is preserved on contenders with back button', () => {
		contendersSetup();
		cy.go('back');
		contendersVerify();
	});

	it('is preserved on contenders with back link', () => {
		contendersSetup();
		cy.findByText(/^Back to Contenders$/).as('back-button');
		cy.get('@back-button').click();
		contendersVerify();
	});

	const chronologySetup = () => {
		cy.visit('/chronology').get('main');
		cy.findByText(/^Colleagues$/).as('colleagues');
		cy.findByText(/^Robert Peel$/).as('peel');
		cy.get('@colleagues').click();
		cy.get('@peel').click();
		cy.location().should((loc) => {
			expect(loc.href).to.include('robert-peel');
		});
	};

	const chronologyVerify = () => {
		cy.findByText(/^Robert Peel$/)
			.as('peel')
			.should('be.visible');
		cy.findByText(/^Charles Jenkinson$/).should('not.be.visible');
	};

	it('is preserved on chronology with back link', () => {
		chronologySetup();
		cy.go('back');
		chronologyVerify();
	});

	it('is preserved on chronology with back link', () => {
		chronologySetup();
		cy.findByText(/^Back to Chronology$/).as('back-button');
		cy.get('@back-button').click();
		chronologyVerify();
	});

	//TODO: test start on post and go back
	// TODO: go to single post, move a few, use back button
	// TODO: louisa -> arbuthnot test
	// TODO: click on one, then go back, then click on another, then press back button
});

export {};
