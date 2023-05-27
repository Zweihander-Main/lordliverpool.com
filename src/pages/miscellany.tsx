import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Miscellany from '../components/Miscellany';
import type { HeadFC } from 'gatsby';

const MiscellanyPage: React.FC = () => (
	<Layout>
		<Miscellany />
	</Layout>
);

export const Head: HeadFC = () => <SEO title="Miscellany" />;

//TODO fix SEO titles

export default MiscellanyPage;
