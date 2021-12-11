import _ from 'cypress/types/lodash';

describe('Scroll state', () => {
	beforeEach(() => {});

	const verifyLocation = (path: string) => {
		cy.location().should((loc) => {
			expect(loc.pathname).to.be.oneOf([path, `${path}/`]);
		});
	};

	context('under chronology', () => {
		const chronologySetup = () => {
			cy.visit('/chronology').get('main');
			cy.findByText(/^Colleagues$/).as('colleagues');
			cy.findByText(/^Robert Peel$/).as('peel');
			cy.get('@colleagues').click();
			cy.get('@peel').click();
			verifyLocation('/chronology/robert-peel');
		};

		const chronologyVerifyState = () => {
			verifyLocation('/chronology');
			cy.findByText(/^Robert Peel$/)
				.as('peel')
				.should('be.visible');
			cy.findByText(/^Charles Jenkinson$/).should('not.be.visible');
		};
		it('is preserved with user back', () => {
			chronologySetup();
			cy.go('back');
			chronologyVerifyState();
		});

		it('is preserved with back link', () => {
			chronologySetup();
			cy.findByText(/^Back to Chronology$/).as('back-button');
			cy.get('@back-button').click();
			chronologyVerifyState();
		});

		it('resets context when navigating between entries', () => {
			cy.visit('/chronology').get('main');
			cy.findByText(/^Family$/)
				.as('family')
				.click();
			cy.findByText(/^Amelia Watts Jenkinson$/)
				.as('amelia')
				.click();
			verifyLocation('/chronology/amelia-watts-jenkinson');
			cy.findByText(/^John Scott, 1st Earl of Eldon$/)
				.as('next')
				.click();
			verifyLocation('/chronology/john-scott-1st-earl-of-eldon');
			cy.findByText(/^Back to Chronology$/)
				.as('back-button')
				.click();
			verifyLocation('/chronology');
			cy.findByText(/^John Scott, 1st Earl of Eldon$/).should(
				'be.visible'
			);
			cy.findByText(/^Amelia Watts Jenkinson$/).should('be.visible');
		});

		it('navigates to particular entry when no previous data held', () => {
			cy.visit('/chronology/john-scott-1st-earl-of-eldon').get('main');
			cy.findByText(/^Back to Chronology$/)
				.as('back-button')
				.click();
			verifyLocation('/chronology');
			cy.findByText(/^John Scott, 1st Earl of Eldon$/).should(
				'be.visible'
			);
			cy.findByText(/^Amelia Watts Jenkinson$/).should('be.visible');
		});

		it('maintains state even between different types of navigation', () => {
			cy.visit('/chronology').get('main');
			cy.findByText(/^Family$/)
				.as('family')
				.click();
			cy.findByText(/^Louisa, Countess of Liverpool$/)
				.as('louisa')
				.click();
			verifyLocation('/chronology/louisa-countess-of-liverpool');
			cy.go('back');
			verifyLocation('/chronology');
			cy.findByText(/^Amelia Watts Jenkinson$/)
				.as('amelia')
				.click();
			verifyLocation('/chronology/amelia-watts-jenkinson');
			cy.findByText(/^Back to Chronology$/)
				.as('back-button')
				.click();
			verifyLocation('/chronology');
			cy.findByText(/^Amelia Watts Jenkinson$/).should('be.visible');
			cy.findByText(/^Louisa, Countess of Liverpool$/).should(
				'not.be.visible'
			);
			cy.findByText(/^John Scott, 1st Earl of Eldon$/).should(
				'be.visible'
			);
		});

		it('maintains state on page reload', () => {
			chronologySetup();
			cy.go('back');
			chronologyVerifyState();
			cy.reload().get('main');
			chronologyVerifyState();
		});
	});

	context('under contenders', () => {
		const contendersSetup = () => {
			cy.visit('/contenders').get('main');
			cy.findByText(/^Theresa May$/).as('theresa');
			cy.findByTestId('caption')
				.as('caption')
				.should('have.text', 'Sir Robert Walpole');
			cy.get('@theresa').click();
			verifyLocation('/contenders/theresa-may');
		};

		const contendersVerifyCaption = () => {
			verifyLocation('/contenders');
			cy.findByTestId('caption').should('have.text', 'Theresa May');
		};

		it('is preserved with user back', () => {
			contendersSetup();
			cy.go('back');
			contendersVerifyCaption();
		});

		it('is preserved with back link', () => {
			contendersSetup();
			cy.findByText(/^Back to Contenders$/).as('back-button');
			cy.get('@back-button').click();
			contendersVerifyCaption();
		});

		it('navigates to particular entry when no previous data held', () => {
			cy.visit('/contenders/theresa-may').get('main');
			cy.findByText(/^Back to Contenders$/)
				.as('back-button')
				.click();
			contendersVerifyCaption();
		});

		it('maintains caption on page reload', () => {
			contendersSetup();
			cy.go('back');
			contendersVerifyCaption();
			cy.reload().get('main');
			contendersVerifyCaption();
		});
	});
});

export {};
