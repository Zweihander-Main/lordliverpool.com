import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Contenders from '../components/Contenders';
import type { HeadFC } from 'gatsby';

const ContendersPage: React.FC = () => (
	<Layout showFooter={false}>
		<Contenders />
	</Layout>
);

export const Head: HeadFC = () => <SEO title="Contenders" app={true} />;

//TODO fix SEO titles

export default ContendersPage;
