import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import type { HeadFC } from 'gatsby';

const NotFoundPage: React.FC = () => (
	<Layout darkMenu={true}>
		<SinglePost
			title="Sorry, this page can't be found."
			content={''}
			linkBackName={'Home'}
			linkBackURL={'/'}
		/>
	</Layout>
);

export const Head: HeadFC = () => <SEO title="404: Not found" />;

export default NotFoundPage;
