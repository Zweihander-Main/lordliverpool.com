import React, { useContext, useEffect } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import { TemplatePageContext } from '../types';
import ScrollLocContext from '../contexts/ScrollLocContext';
import type { HeadFC } from 'gatsby';

const ChronologyPostTemplate: React.FC<
	PageProps<Queries.ChronologyPostBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { prev, next } = pageContext;

	const id = post?.id;
	const { dispatch } = useContext(ScrollLocContext);
	useEffect(() => {
		if (id) {
			dispatch({ type: 'updateId', payload: id, track: 'chronology' });
		}
	}, [dispatch, id]);

	return (
		<Layout darkMenu={true}>
			<SinglePost
				headerImage={
					post?.frontmatter?.featuredImage?.childImageSharp
						?.gatsbyImageData
				}
				title={post?.frontmatter?.title || ''}
				content={post?.html || ''}
				subtitle={post?.frontmatter?.card}
				extraHeaderText={post?.frontmatter?.displayDate}
				linkBackName={'Chronology'}
				linkBackURL={'/chronology'}
				next={next}
				prev={prev}
			/>
		</Layout>
	);
};

export const Head: HeadFC<Queries.ChronologyPostBySlugQuery> = ({ data }) => {
	const post = data.markdownRemark;
	const ogImage =
		data.ogImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	const twitterImage =
		data.twitterImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	return (
		<SEO
			title={post?.frontmatter?.title || ''}
			description={post?.frontmatter?.description || post?.excerpt || ''}
		>
			<meta id="og-type" name="og:type" content="article" />
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

export default ChronologyPostTemplate;

export const pageQuery = graphql`
	query ChronologyPostBySlug($path: String!) {
		markdownRemark(fields: { slug: { eq: $path } }) {
			excerpt(pruneLength: 160)
			html
			id
			frontmatter {
				title
				card
				displayDate
				description
				featuredImage {
					childImageSharp {
						gatsbyImageData(
							width: 540
							layout: CONSTRAINED
							quality: 70
						)
					}
				}
			}
		}
		ogImage: markdownRemark(fields: { slug: { eq: $path } }) {
			...OgImage
		}
		twitterImage: markdownRemark(fields: { slug: { eq: $path } }) {
			...TwitterImage
		}
	}
`;
