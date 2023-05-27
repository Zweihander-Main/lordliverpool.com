import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Hero from '../components/IndexHero';
import Modal from '../components/RetailersModal';
import BookInfo from '../components/IndexBookInfo';

const IndexPage: React.FC = () => {
	return (
		<Layout isHome={true}>
			<SEO />
			<Hero />
			<Modal />
			<BookInfo />
		</Layout>
	);
};

export default IndexPage;
