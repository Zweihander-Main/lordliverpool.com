import React from 'react';
import { HeadFC } from 'gatsby';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Chronology from '../components/Chronology';

const ChronologyPage: React.FC = () => {
	return (
		<Layout showFooter={false} miniMenu={true}>
			<Chronology />
		</Layout>
	);
};

export const Head: HeadFC = () => <SEO title="Chronology" />;

//TODO fix SEO titles

export default ChronologyPage;
