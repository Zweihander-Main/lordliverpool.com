import React from 'react';

import Layout from '../components/structure/layout';
import SEO from '../components/structure/seo';
import Chronology from '../components/chronology';

const ChronologyPage: React.FC = () => {
	return (
		<Layout showFooter={false} miniMenu={true}>
			<SEO title="Chronology" app={true} />
			<Chronology />
		</Layout>
	);
};

//TODO fix SEO titles

export default ChronologyPage;
