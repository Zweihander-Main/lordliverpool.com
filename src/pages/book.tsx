import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';

const Book: React.FC = () => {
	const bookData = useStaticQuery<GatsbyTypes.BookQuery>(graphql`
		query Book {
			markdownRemark(fields: { slug: { eq: "/pages/book" } }) {
				html
				frontmatter {
					title
					description
					featuredImage {
						childImageSharp {
							fluid(maxWidth: 550) {
								...GatsbyImageSharpFluid
							}
						}
					}
				}
			}
		}
	`);

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
					page?.frontmatter?.featuredImage?.childImageSharp?.fluid
				}
				title={page?.frontmatter?.title || ''}
				content={page?.html || ''}
			/>
		</Layout>
	);
};

export default Book;
