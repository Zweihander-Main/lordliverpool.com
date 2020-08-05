import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';

const NotFoundPage: React.FC = () => (
	<Layout>
		<SEO title="404: Not found" />
		<h1>NOT FOUND</h1>
	</Layout>
);

export default NotFoundPage;
