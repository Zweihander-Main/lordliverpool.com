import React from 'react';
import { PageProps, graphql } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import type { HeadFC } from 'gatsby';

const Book: React.FC<PageProps<Queries.BookQuery>> = ({ data }) => {
	const page = data.markdownRemark;

	// TODO descriptions and excerpts aren't being populated consistently
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

export const Head: HeadFC<Queries.BookQuery> = ({ data }) => {
	const info = data.markdownRemark;
	const ogImage =
		data.ogImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	const twitterImage =
		data.twitterImage?.frontmatter?.featuredImage?.childImageSharp
			?.gatsbyImageData.images.fallback?.src;
	const authorUrl = `${data.site?.siteMetadata?.siteUrl || ''}/author`;
	const releaseDate = info?.frontmatter?.releaseDate;
	const isbn = info?.frontmatter?.isbn;
	const seoTags = info?.frontmatter?.seoTags;
	return (
		<SEO
			title={info?.frontmatter?.title || ''}
			description={info?.frontmatter?.description || info?.excerpt || ''}
		>
			<meta id="og-type" name="og:type" content="book" />
			<meta id="book-author" name="book:author" content={authorUrl} />
			{isbn && <meta id="book-isbn" name="book:isbn" content={isbn} />}
			{releaseDate && (
				<meta
					id="book-release"
					name="book:release_date"
					content="2021-05-01"
				/>
			)}
			{seoTags &&
				seoTags.map((tag, i) => (
					<meta
						key={tag}
						id={`book-tag-${i}`}
						name="book:tag"
						content={tag as string}
					/>
				))}
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

export default Book;

export const pageQuery = graphql`
	query Book {
		markdownRemark(fields: { slug: { eq: "/pages/book" } }) {
			html
			excerpt(pruneLength: 160)
			frontmatter {
				title
				description
				isbn
				releaseDate
				seoTags
				featuredImage {
					childImageSharp {
						gatsbyImageData(width: 550, layout: CONSTRAINED)
					}
				}
			}
		}
		site {
			...SiteData
		}
		ogImage: markdownRemark(fields: { slug: { eq: "/pages/book" } }) {
			...OgImage
		}
		twitterImage: markdownRemark(fields: { slug: { eq: "/pages/book" } }) {
			...TwitterImage
		}
	}
`;
