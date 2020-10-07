import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';

const ContenderPostTemplate: React.FC<PageProps<
	GatsbyTypes.ContenderPostBySlugQuery
>> = ({ data }, ...ect) => {
	console.log(data);
	console.log(ect);
	const post = data.markdownRemark;

	return (
		<Layout>
			<SEO
				title={post?.frontmatter?.title || ''}
				description={
					post?.frontmatter?.description || post?.excerpt || ''
				}
			/>

			<SinglePost
				headerImage={
					post?.frontmatter?.featuredImage?.childImageSharp?.fluid
				}
				title={post?.frontmatter?.title || ''}
				content={post?.html || ''}
				extraHeaderText={post?.frontmatter?.displayDate}
				linkBackName={'Contenders'}
				linkBackURL={'/contenders'}
			/>
		</Layout>
	);
};

export default ContenderPostTemplate;

export const pageQuery = graphql`
	query ContenderPostBySlug($path: String!) {
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
				displayDate
				description
				featuredImage {
					childImageSharp {
						fluid(maxWidth: 540) {
							...GatsbyImageSharpFluid
						}
					}
				}
			}
		}
	}
`;
