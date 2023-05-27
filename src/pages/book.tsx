import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';

type BookQuery = {
	readonly markdownRemark: Queries.Maybe<
		Pick<Queries.MarkdownRemark, 'html' | 'excerpt'> & {
			readonly frontmatter: Queries.Maybe<
				Pick<
					Queries.MarkdownRemarkFrontmatter,
					'title' | 'description'
				> & {
					readonly featuredImage: Queries.Maybe<{
						readonly childImageSharp: Queries.Maybe<
							Pick<Queries.ImageSharp, 'gatsbyImageData'>
						>;
					}>;
				}
			>;
		}
	>;
};

const Book: React.FC = () => {
	/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
	const bookData: BookQuery = useStaticQuery<Queries.BookQuery>(graphql`
		query Book {
			markdownRemark(fields: { slug: { eq: "/pages/book" } }) {
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
		}
	`);
	/* eslint-enable  @typescript-eslint/no-unsafe-assignment */

	const page = bookData.markdownRemark;

	// TODO descriptions and excerpts aren't being populated consistently
	return (
		<Layout darkMenu={true}>
			<SEO
				title={page?.frontmatter?.title || ''}
				description={
					page?.frontmatter?.description || page?.excerpt || ''
				}
			/>

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

export default Book;
