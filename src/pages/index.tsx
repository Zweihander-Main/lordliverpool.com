import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Hero from '../components/IndexHero';
import Modal from '../components/RetailersModal';
import BookInfo from '../components/IndexBookInfo';
import type { HeadFC } from 'gatsby';

const IndexPage: React.FC = () => {
	return (
		<Layout isHome={true}>
			<Hero />
			<Modal />
			<BookInfo />
		</Layout>
	);
};

export const Head: HeadFC = () => <SEO />;

export default IndexPage;
