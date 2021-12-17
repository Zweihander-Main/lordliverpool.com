describe('Accessibility tests', () => {
	beforeEach(() => {});
	const visitAndInject = (loc: string) => {
		cy.visit(loc).get('main').injectAxe();
	};

	it('Has no detectable accessibility violations on load', () => {
		visitAndInject('/');
		cy.checkA11yWithLog();
	});
	it('Has no violations on any of the main non-path navigation links', () => {
		visitAndInject('/author');
		cy.checkA11yWithLog();
		visitAndInject('/book');
		cy.checkA11yWithLog();
	});
	it('Has no violations in the chronology path', () => {
		visitAndInject('/chronology');
		cy.checkA11yWithLog();
		cy.findByText(/^Charles Jenkinson$/).click();
		cy.verifyLocation('/chronology/charles-jenkinson');
		cy.get('main').injectAxe();
		cy.checkA11yWithLog();
	});
	it('Has no violations in the contenders path', () => {
		visitAndInject('/contenders');
		cy.checkA11yWithLog();
		cy.findByText(/^Spencer, 1st Earl of Wilmington$/).click();
		cy.verifyLocation('/contenders/spencer-1st-earl-of-wilmington');
		cy.get('main').injectAxe();
		cy.checkA11yWithLog();
	});
	it('Has no violations in the miscellany path', () => {
		visitAndInject('/miscellany');
		cy.loadImageByAltText('The decline of good economics');
		cy.checkA11yWithLog();
		cy.findByText(/^The decline of good economics/)
			.parent()
			.parent()
			.parent()
			.click();
		cy.verifyLocation('/miscellany/the-decline-of-good-economics');
		cy.get('main').injectAxe();
		cy.checkA11yWithLog();
	});
});

export {};
