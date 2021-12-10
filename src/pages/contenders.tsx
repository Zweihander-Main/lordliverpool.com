import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import Contenders from 'components/contenders';

const ContendersPage: React.FC = () => (
	<Layout showFooter={false}>
		<SEO title="Contenders" app={true} />
		<Contenders />
	</Layout>
);

//TODO fix SEO titles

export default ContendersPage;
