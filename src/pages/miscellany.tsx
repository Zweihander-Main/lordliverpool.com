import React from 'react';

import Layout from '../components/structure/layout';
import SEO from '../components/structure/seo';
import Miscellany from '../components/miscellany';

const MiscellanyPage: React.FC = () => (
	<Layout>
		<SEO title="Miscellany" />
		<Miscellany />
	</Layout>
);

//TODO fix SEO titles

export default MiscellanyPage;
