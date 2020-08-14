import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import Hero from 'components/index/hero';
import BookInfo from 'components/index/bookInfo';
import Chronology from 'components/index/chronology';
import Contenders from 'components/index/contenders';
import Miscellany from 'components/index/miscellany';

const IndexPage: React.FC = () => (
	<Layout isHome={true}>
		<SEO title="Home" />
		<Hero />
		<BookInfo />
		<Chronology />
		<Contenders />
		<Miscellany />
	</Layout>
);

export default IndexPage;
