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

export const Head: HeadFC<Queries.AuthorQuery> = ({ data }) => (
	<SEO
		title={data.markdownRemark?.frontmatter?.title || ''}
		description={
			data.markdownRemark?.frontmatter?.description ||
			data.markdownRemark?.excerpt ||
			''
		}
	/>
);

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
	}
`;
