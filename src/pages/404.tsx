import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';

const NotFoundPage: React.FC = () => (
	<Layout darkMenu={true}>
		<SEO title="404: Not found" />
		<SinglePost
			title="Sorry, this page can't be found."
			content={''}
			linkBackName={'Home'}
			linkBackURL={'/'}
		/>
	</Layout>
);

export default NotFoundPage;
