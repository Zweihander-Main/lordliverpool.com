import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Miscellany from '../components/Miscellany';

const MiscellanyPage: React.FC = () => (
	<Layout>
		<SEO title="Miscellany" />
		<Miscellany />
	</Layout>
);

//TODO fix SEO titles

export default MiscellanyPage;
