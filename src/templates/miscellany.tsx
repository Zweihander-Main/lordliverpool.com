import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';

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

			<SinglePost
				headerImage={
					post.frontmatter.featuredImage.childImageSharp.fluid
				}
				title={post?.frontmatter?.title || ''}
				subtitle={post?.frontmatter?.subtitle}
				content={post?.html || ''}
				meta={post?.frontmatter?.date}
				linkBackName={'Miscellany'}
				linkBackURL={'/miscellany'}
			/>
		</Layout>
	);
};

export default MiscellanyPostTemplate;

export const pageQuery = graphql`
	query BlogPostBySlug($path: String!) {
		markdownRemark(fields: { slug: { eq: $path } }) {
			excerpt(pruneLength: 160)
			html
			frontmatter {
				title
				date(formatString: "MMMM DD, YYYY")
				description
				subtitle
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
