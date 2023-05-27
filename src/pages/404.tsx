import React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';

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
