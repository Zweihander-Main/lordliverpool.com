import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import Chronology from 'components/chronology';

const ChronologyPage: React.FC = ({ location }) => {
	const upperState = location?.state?.upperState;
	return (
		<Layout showFooter={false}>
			<SEO title="Chronology" app={true} />
			<Chronology upperState={upperState} />
		</Layout>
	);
};

//TODO fix SEO titles

export default ChronologyPage;
