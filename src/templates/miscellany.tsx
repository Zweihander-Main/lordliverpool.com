import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import MiscellanySinglePost from 'components/miscellany/singlePost';

const MiscellanyPostTemplate: React.FC<PageProps<
	GatsbyTypes.BlogPostBySlugQuery
>> = ({ data }) => {
	const post = data.markdownRemark;

	if (!post?.frontmatter?.featuredImage?.childImageSharp?.fluid) {
		throw new Error(
			`Image for post ${JSON.stringify(
				post?.frontmatter?.title
			)} not found.`
		);
	}

	return (
		<Layout>
			<SEO
				title={post?.frontmatter?.title || ''}
				description={
					post?.frontmatter?.description || post?.excerpt || ''
				}
			/>

			<MiscellanySinglePost
				headerImage={
					post.frontmatter.featuredImage.childImageSharp.fluid
				}
				title={post?.frontmatter?.title || ''}
				subtitle={post?.frontmatter?.subtitle}
				content={post?.html || ''}
				date={post?.frontmatter?.date}
			/>
		</Layout>
	);
};

export default MiscellanyPostTemplate;

export const pageQuery = graphql`
	query BlogPostBySlug($path: String!) {
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
				date(formatString: "MMMM DD, YYYY")
				description
				subtitle
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
