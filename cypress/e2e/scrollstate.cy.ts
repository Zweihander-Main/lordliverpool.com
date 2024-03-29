import _ from 'cypress/types/lodash';

describe('Scroll state', () => {
	beforeEach(() => {});

	context('under chronology', () => {
		const chronologySetup = () => {
			cy.visit('/chronology').get('main');
			cy.loadImageByAltText('Anthony Jenkinson');
			cy.findByText(/^Colleagues$/).as('colleagues');
			cy.findByText(/^Robert Peel$/).as('peel');
			cy.get('@colleagues').click();
			cy.get('@peel').click();
			cy.verifyLocation('/chronology/robert-peel');
			cy.loadImageByAltText('Robert Peel');
		};

		const chronologyVerifyState = () => {
			cy.verifyLocation('/chronology');
			cy.loadImageByAltText('Robert Peel');
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
			cy.findByLabelText(/^Back to /).as('back-button');
			cy.get('@back-button').click();
			chronologyVerifyState();
		});

		it('resets context when navigating between entries', () => {
			cy.visit('/chronology').get('main');
			cy.loadImageByAltText('Anthony Jenkinson');
			cy.findByText(/^Family$/)
				.as('family')
				.click();
			cy.findByText(/^Amelia Watts Jenkinson$/);
			cy.loadImageByAltText('Amelia Watts Jenkinson');
			cy.findByText(/^Amelia Watts Jenkinson$/).click();
			cy.verifyLocation('/chronology/amelia-watts-jenkinson');
			cy.loadImageByAltText('Amelia Watts Jenkinson');
			cy.findByLabelText(/^Next entry: /)
				.as('next')
				.click();
			cy.verifyLocation('/chronology/john-scott-1st-earl-of-eldon');
			cy.loadImageByAltText('John Scott, 1st Earl of Eldon');
			cy.findByLabelText(/^Back to /)
				.as('back-button')
				.click();
			cy.verifyLocation('/chronology');
			cy.loadImageByAltText('John Scott, 1st Earl of Eldon');
			cy.findByText(/^John Scott, 1st Earl of Eldon$/).should(
				'be.visible'
			);
		});

		it('navigates to particular entry when no previous data held', () => {
			cy.visit('/chronology/john-scott-1st-earl-of-eldon').get('main');
			cy.loadImageByAltText('John Scott, 1st Earl of Eldon');
			cy.findByLabelText(/^Back to /)
				.as('back-button')
				.click();
			cy.verifyLocation('/chronology');
			cy.loadImageByAltText('John Scott, 1st Earl of Eldon');
			cy.findByText(/^John Scott, 1st Earl of Eldon$/).should(
				'be.visible'
			);
			cy.findByText(/^Amelia Watts Jenkinson$/).should('be.visible');
		});

		it('maintains state even between different types of navigation', () => {
			cy.visit('/chronology').get('main');
			cy.loadImageByAltText('Anthony Jenkinson');
			cy.findByText(/^Family$/)
				.as('family')
				.click();
			cy.findByText(/^Louisa, Countess of Liverpool$/)
				.as('louisa')
				.click();
			cy.verifyLocation('/chronology/louisa-countess-of-liverpool');
			cy.loadImageByAltText('Louisa, Countess of Liverpool');
			cy.go('back');
			cy.verifyLocation('/chronology');
			cy.loadImageByAltText('Louisa, Countess of Liverpool');
			cy.findByText(/^Amelia Watts Jenkinson$/)
				.as('amelia')
				.click();
			cy.verifyLocation('/chronology/amelia-watts-jenkinson');
			cy.loadImageByAltText('Amelia Watts Jenkinson');
			cy.findByLabelText(/^Back to /)
				.as('back-button')
				.click();
			cy.verifyLocation('/chronology');
			cy.loadImageByAltText('Amelia Watts Jenkinson');
			cy.findByText(/^Amelia Watts Jenkinson$/).should('be.visible');
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
			cy.loadImageByAltText('Sir Robert Walpole');
			cy.findByText(/^Theresa May$/).as('theresa');
			cy.findByTestId('caption')
				.as('caption')
				.should('have.text', 'Sir Robert Walpole');
			cy.get('@theresa').click();
			cy.verifyLocation('/contenders/theresa-may');
			cy.loadImageByAltText('Theresa May');
		};

		const contendersVerifyCaption = () => {
			cy.verifyLocation('/contenders');
			cy.loadImageByAltText('Theresa May');
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
			cy.loadImageByAltText('Theresa May');
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
