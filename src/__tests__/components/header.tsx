import React from 'react';
import { render } from '@testing-library/react';

import Header from 'components/structure/header';
// You have to write data-testid
const Title = () => <h1 data-testid="hero-title">Gatsby is awesome!</h1>;
test('Displays the correct title', () => {
	const { getByTestId } = render(<Title />);
	// Assertion
	expect(getByTestId('hero-title')).toHaveTextContent('Gatsby is awesome!');
	// --> Test will pass
});
// describe('Header', () => {
// 	it('renders correctly', () => {
// 		const tree = renderer
// 			.create(<Header siteTitle="Default Starter" />)
// 			.toJSON();
// 		expect(tree).toMatchSnapshot();
// 	});
// });
