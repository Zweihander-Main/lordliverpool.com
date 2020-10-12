import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import Hero from 'components/index/hero';
import Modal from 'components/shared/retailersModal';
import BookInfo from 'components/index/bookInfo';
import Miscellany from 'components/index/miscellany';

const IndexPage: React.FC = () => {
	return (
		<Layout isHome={true}>
			<SEO title="Home" />
			<Hero />
			<Modal />
			<BookInfo />
			<Miscellany />
		</Layout>
	);
};

export default IndexPage;
