import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import Hero from 'components/index/hero';
import BookInfo from 'components/index/bookInfo';
import Miscellany from 'components/index/miscellany';

const IndexPage: React.FC = () => (
	<Layout isHome={true}>
		<SEO title="Home" />
		<Hero />
		<BookInfo />
		<Miscellany />
	</Layout>
);

export default IndexPage;
