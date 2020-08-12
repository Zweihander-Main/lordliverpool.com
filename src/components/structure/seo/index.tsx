import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

type SEOProps = {
	description?: string;
	lang?: string;
	meta?: Array<
		| {
				name: string;
				content: string;
				property?: undefined;
		  }
		| {
				property: string;
				content: string;
				name?: undefined;
		  }
	>;
	title: string;
};

const SEO: React.FC<SEOProps> = ({
	description = '',
	lang = 'en',
	meta = [],
	title,
}) => {
	const { site } = useStaticQuery<GatsbyTypes.SEOSiteMetadataQuery>(
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

	return (
		<Helmet
			htmlAttributes={{
				lang,
			}}
			title={title}
			titleTemplate={`%s | ${site.siteMetadata.title}`}
			meta={[
				{
					name: 'description',
					content: metaDescription,
				},
				{
					property: 'og:title',
					content: title,
				},
				{
					property: 'og:description',
					content: metaDescription,
				},
				{
					property: 'og:type',
					content: 'website',
				},
				{
					name: 'twitter:card',
					content: 'summary',
				},
				{
					name: 'twitter:creator',
					content: site.siteMetadata.author,
				},
				{
					name: 'twitter:title',
					content: title,
				},
				{
					name: 'twitter:description',
					content: metaDescription,
				},
			].concat(meta)}
		/>
	);
};

export default SEO;
