import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';

const Author: React.FC = () => {
	const authorData = useStaticQuery<GatsbyTypes.AuthorQuery>(graphql`
		query Author {
			markdownRemark(fields: { slug: { eq: "/pages/author" } }) {
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

	const page = authorData.markdownRemark;

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

export default Author;
