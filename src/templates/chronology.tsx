import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import ChronologySinglePost from 'components/chronology/singlePost';

const ChronologyPostTemplate: React.FC<PageProps<
	GatsbyTypes.ChronologyPostBySlugQuery
>> = ({ data }) => {
	const post = data.markdownRemark;

	return (
		<Layout>
			<SEO
				title={post?.frontmatter?.title || ''}
				description={
					post?.frontmatter?.description || post?.excerpt || ''
				}
			/>

			<ChronologySinglePost
				headerImage={
					post?.frontmatter?.featuredImage?.childImageSharp?.fluid
				}
				title={post?.frontmatter?.title || ''}
				content={post?.html || ''}
				subtitle={post?.frontmatter?.card}
				extraHeaderText={post?.frontmatter?.displayDate}
			/>
		</Layout>
	);
};

export default ChronologyPostTemplate;

export const pageQuery = graphql`
	query ChronologyPostBySlug($path: String!) {
		site {
			siteMetadata {
				title
			}
		}
		markdownRemark(fields: { slug: { eq: $path } }) {
			id
			excerpt(pruneLength: 160)
			html
			frontmatter {
				title
				card
				displayDate
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
`;
