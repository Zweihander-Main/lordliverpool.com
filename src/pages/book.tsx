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

export const Head: HeadFC<Queries.BookQuery> = ({ data }) => (
	<SEO
		title={data.markdownRemark?.frontmatter?.title || ''}
		description={
			data.markdownRemark?.frontmatter?.description ||
			data.markdownRemark?.excerpt ||
			''
		}
	/>
);

export default Book;

export const pageQuery = graphql`
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
`;
