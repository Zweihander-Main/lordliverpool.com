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
	children,
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
			<meta
				id="meta-description"
				name="description"
				content={metaDescription}
			/>
			<meta
				id="meta-author"
				name="author"
				content={site.siteMetadata.author}
			/>
			<meta
				id="og-title"
				name="og:title"
				content={title !== '' ? title : site.siteMetadata.title}
			/>
			<meta
				id="og-description"
				name="og:description"
				content={metaDescription}
			/>
			<meta id="og-type" name="og:type" content="website" />
			{/*TODO add in og:image and twitter:image*/}
			<meta id="og-image" name="og:image" content="" />
			<meta id="twitter-image" name="twitter:image" content="" />
			<meta id="twitter-card" name="twitter:card" content="summary" />
			<meta
				id="twitter-creator"
				name="twitter:creator"
				content={site.siteMetadata.author}
			/>
			<meta
				id="twitter-title"
				name="twitter:title"
				content={title !== '' ? title : site.siteMetadata.title}
			/>
			<meta
				id="twitter-description"
				name="twitter:description"
				content={metaDescription}
			/>
			{children}
		</>
	);
};

export default SEO;

/** SEO images for use in templates */
export const socialQueries = graphql`
	fragment OgImage on MarkdownRemark {
		frontmatter {
			featuredImage {
				childImageSharp {
					gatsbyImageData(
						width: 1200
						layout: FIXED
						quality: 70
						aspectRatio: 1.91
					)
				}
			}
		}
	}
	fragment TwitterImage on MarkdownRemark {
		frontmatter {
			featuredImage {
				childImageSharp {
					gatsbyImageData(
						width: 1200
						layout: FIXED
						quality: 70
						aspectRatio: 2
					)
				}
			}
		}
	}
`;
