import React from 'react';
import { render } from '@testing-library/react';
import AppContext from '../AppContext';

describe('AppContext', () => {
	it('renders a component', () => {
		expect(render(<AppContext />));
	});
});
