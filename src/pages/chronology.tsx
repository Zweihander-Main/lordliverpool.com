import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Chronology from '../components/Chronology';

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
