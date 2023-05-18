import React from 'react';

import Layout from '../components/structure/layout';
import SEO from '../components/structure/seo';
import Hero from '../components/index/hero';
import Modal from '../components/shared/retailers/retailersModal';
import BookInfo from '../components/index/bookInfo';

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
