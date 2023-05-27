import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

type SEOProps = {
	description?: string;
	title?: string;
	app?: boolean;
};

const SEO: React.FC<React.PropsWithChildren<SEOProps>> = ({
	description = '',
	title = '',
	app = false,
}) => {
	const { site } = useStaticQuery<Queries.SEOSiteMetadataQuery>(
		graphql`
			query SEOSiteMetadata {
				site {
					siteMetadata {
						title
						description
						author
					}
				}
			}
		`
	);

	if (
		!(
			site &&
			site?.siteMetadata &&
			site.siteMetadata.title &&
			site.siteMetadata.description &&
			site.siteMetadata.author
		)
	) {
		throw new Error('Some part of SEO required site metadata is missing.');
	}

	const metaDescription = description || site.siteMetadata.description;

	let htmlClass = '';
	if (app) {
		htmlClass += 'app-body ';
	}

	let bodyClass = '';
	if (app) {
		bodyClass += 'app-body ';
	}

	const fullPageTitle = `${title}${title !== '' ? ' | ' : ''}${
		site.siteMetadata.title
	}`;

	return (
		<>
			<html className={htmlClass} lang="en"></html>
			<body className={bodyClass}></body>
			<title>{fullPageTitle}</title>
			<meta name="description" content={metaDescription} />
			<meta name="author" content={site.siteMetadata.author} />
			<meta
				name="og:title"
				content={title !== '' ? title : site.siteMetadata.title}
			/>
			<meta name="og:description" content={metaDescription} />
			<meta name="og:type" content="website" />
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:creator" content={site.siteMetadata.author} />
			<meta
				name="twitter:title"
				content={title !== '' ? title : site.siteMetadata.title}
			/>
			<meta name="twitter:description" content={metaDescription} />
		</>
	);
};

export default SEO;
