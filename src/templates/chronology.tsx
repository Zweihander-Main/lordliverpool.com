import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';

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
			frontmatter {
				title
				description
			}
		}
	}
`;
