import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';

const Book: React.FC = () => {
	const bookData = useStaticQuery<GatsbyTypes.BookQuery>(graphql`
		query Book {
			markdownRemark(fields: { slug: { eq: "/pages/book" } }) {
				id
				html
				frontmatter {
					title
					description
					featuredImage {
						childImageSharp {
							fluid {
								...GatsbyImageSharpFluid
							}
						}
					}
				}
			}
		}
	`);

	const page = bookData.markdownRemark;

	return (
		<Layout>
			<SEO
				title={page?.frontmatter?.title || ''}
				description={
					page?.frontmatter?.description || page?.excerpt || ''
				}
			/>

			<SinglePost
				headerImage={
					page?.frontmatter?.featuredImage?.childImageSharp?.fluid
				}
				title={page?.frontmatter?.title || ''}
				content={page?.html || ''}
			/>
		</Layout>
	);
};

export default Book;
