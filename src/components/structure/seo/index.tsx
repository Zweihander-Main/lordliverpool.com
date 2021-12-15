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
	title?: string;
	app?: boolean;
};

const SEO: React.FC<SEOProps> = ({
	description = '',
	lang = 'en',
	meta = [],
	title = '',
	app = false,
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

	let htmlClass = '';
	if (app) {
		htmlClass += 'app-body ';
	}

	let bodyClass = '';
	if (app) {
		bodyClass += 'app-body ';
	}

	return (
		<Helmet
			htmlAttributes={{
				class: htmlClass,
				lang,
			}}
			bodyAttributes={{
				class: bodyClass,
			}}
			title={title !== '' ? title : undefined}
			titleTemplate={`%s | ${site.siteMetadata.title}`}
			defaultTitle={site.siteMetadata.title}
			meta={[
				{
					name: 'description',
					content: metaDescription,
				},
				{
					property: 'og:title',
					content: title !== '' ? title : site.siteMetadata.title,
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
					content: title !== '' ? title : site.siteMetadata.title,
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
