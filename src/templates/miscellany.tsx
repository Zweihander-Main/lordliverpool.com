import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import { TemplatePageContext } from '../types';
import type { HeadFC } from 'gatsby';

const MiscellanyPostTemplate: React.FC<
	PageProps<Queries.BlogPostBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { next, prev } = pageContext;

	if (!post?.frontmatter?.featuredImage?.childImageSharp?.gatsbyImageData) {
		throw new Error(
			`Image for post ${JSON.stringify(
				post?.frontmatter?.title
			)} not found.`
		);
	}

	return (
		<Layout darkMenu={true}>
			<SinglePost
				headerImage={
					post.frontmatter.featuredImage.childImageSharp
						.gatsbyImageData
				}
				title={post?.frontmatter?.title || ''}
				subtitle={post?.frontmatter?.subtitle}
				content={post?.html || ''}
				meta={post?.frontmatter?.date}
				linkBackName={'Miscellany'}
				linkBackURL={'/miscellany'}
				next={next}
				prev={prev}
			/>
		</Layout>
	);
};

export const Head: HeadFC<Queries.BlogPostBySlugQuery> = ({ data }) => {
	const post = data.markdownRemark;
	const ogImage =
		data.ogImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	const twitterImage =
		data.twitterImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	const authorUrl = `${data.site?.siteMetadata?.siteUrl || ''}/author`;
	return (
		<SEO
			title={post?.frontmatter?.title || ''}
			description={post?.frontmatter?.description || post?.excerpt || ''}
		>
			<meta id="og-type" name="og:type" content="article" />
			<meta
				id="article-published"
				name="article:published_time"
				content={post?.frontmatter?.date || ''}
			/>
			<meta
				id="article-author"
				name="article:author"
				content={authorUrl}
			/>
			<meta
				id="article-section"
				name="article:section"
				content="Miscellany"
			/>
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

export default MiscellanyPostTemplate;

export const pageQuery = graphql`
	query BlogPostBySlug($path: String!) {
		markdownRemark(fields: { slug: { eq: $path } }) {
			excerpt(pruneLength: 160)
			html
			frontmatter {
				title
				date(formatString: "MMMM DD, YYYY")
				description
				subtitle
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
		site {
			...SiteData
		}
		ogImage: markdownRemark(fields: { slug: { eq: $path } }) {
			...OgImage
		}
		twitterImage: markdownRemark(fields: { slug: { eq: $path } }) {
			...TwitterImage
		}
	}
`;
