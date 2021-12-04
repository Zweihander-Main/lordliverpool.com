import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';

type BookQuery = {
	readonly markdownRemark: GatsbyTypes.Maybe<
		Pick<GatsbyTypes.MarkdownRemark, 'html' | 'excerpt'> & {
			readonly frontmatter: GatsbyTypes.Maybe<
				Pick<
					GatsbyTypes.MarkdownRemarkFrontmatter,
					'title' | 'description'
				> & {
					readonly featuredImage: GatsbyTypes.Maybe<{
						readonly childImageSharp: GatsbyTypes.Maybe<
							Pick<GatsbyTypes.ImageSharp, 'gatsbyImageData'>
						>;
					}>;
				}
			>;
		}
	>;
};

const Book: React.FC = () => {
	/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
	const bookData: BookQuery = useStaticQuery<GatsbyTypes.BookQuery>(graphql`
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
