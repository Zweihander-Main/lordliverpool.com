import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Contenders from '../components/Contenders';

const ContendersPage: React.FC = () => (
	<Layout showFooter={false}>
		<SEO title="Contenders" app={true} />
		<Contenders />
	</Layout>
);

//TODO fix SEO titles

export default ContendersPage;
