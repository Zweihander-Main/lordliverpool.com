import React from 'react';
import { PageProps, graphql } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import type { HeadFC } from 'gatsby';

const Author: React.FC<PageProps<Queries.AuthorQuery>> = ({ data }) => {
	const page = data.markdownRemark;

	return (
		<Layout darkMenu={true}>
			<SinglePost
				headerImage={
					page?.frontmatter?.featuredImage?.childImageSharp
						?.gatsbyImageData
				}
				title={page?.frontmatter?.title || ''}
				content={page?.html || ''}
			/>
		</Layout>
	);
};

export const Head: HeadFC<Queries.AuthorQuery> = ({ data }) => {
	const info = data.markdownRemark;
	const ogImage =
		data.ogImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	const twitterImage =
		data.twitterImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	return (
		<SEO
			title={info?.frontmatter?.title || ''}
			description={info?.frontmatter?.description || info?.excerpt || ''}
		>
			<meta id="og-type" name="og:type" content="profile" />
			<meta
				id="profile-first"
				name="profile:first_name"
				content="Martin"
			/>
			<meta
				id="profile-last"
				name="profile:last_name"
				content="Hutchinson"
			/>
			<meta
				id="profile-username"
				name="profile:username"
				content="TBWNS"
			/>
			<meta id="profile-gender" name="profile:gender" content="male" />
			{ogImage && (
				<meta id="og-image" name="og:image" content={ogImage} />
			)}
			{twitterImage && (
				<>
					<meta
						id="twitter-card"
						name="twitter:card"
						content="summary_large_image"
					/>
					<meta
						id="twitter-image"
						name="twitter:image"
						content={twitterImage}
					/>
				</>
			)}
		</SEO>
	);
};

export default Author;

export const pageQuery = graphql`
	query Author {
		markdownRemark(fields: { slug: { eq: "/pages/author" } }) {
			html
			excerpt(pruneLength: 160)
			frontmatter {
				title
				description
				featuredImage {
					childImageSharp {
						gatsbyImageData(width: 550, layout: CONSTRAINED)
					}
				}
			}
		}
		ogImage: markdownRemark(fields: { slug: { eq: "/pages/author" } }) {
			...OgImage
		}
		twitterImage: markdownRemark(
			fields: { slug: { eq: "/pages/author" } }
		) {
			...TwitterImage
		}
	}
`;
