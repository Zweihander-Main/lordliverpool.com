/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Header from 'components/structure/header';
import Footer from 'components/structure/footer';
import 'styles/base.global.scss';
import styles from './layout.module.scss';

type SiteTitleQueryProps = {
	site: {
		siteMetadata: {
			title: string;
		};
	};
};

const Layout: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
	children,
}) => {
	const data = useStaticQuery<SiteTitleQueryProps>(graphql`
		query SiteTitleQuery {
			site {
				siteMetadata {
					title
				}
			}
		}
	`);

	return (
		<React.Fragment>
			<Header siteTitle={data.site.siteMetadata.title} />
			<div className={styles.content}>
				<main>{children}</main>
				<Footer />
			</div>
		</React.Fragment>
	);
};

export default Layout;
