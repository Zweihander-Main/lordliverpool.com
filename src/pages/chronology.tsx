import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import Chronology from 'components/chronology';

const MiscellanyPage: React.FC = () => (
	<Layout>
		<SEO title="Chronology" />
		<Chronology />
	</Layout>
);

//TODO fix SEO titles

export default MiscellanyPage;
