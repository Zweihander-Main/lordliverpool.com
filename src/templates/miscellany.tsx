import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import { TemplatePageContext } from '../types';
import type { HeadFC } from 'gatsby';

const MiscellanyPostTemplate: React.FC<
	PageProps<Queries.BlogPostBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { next, prev } = pageContext;

	if (!post?.frontmatter?.featuredImage?.childImageSharp?.gatsbyImageData) {
		throw new Error(
			`Image for post ${JSON.stringify(
				post?.frontmatter?.title
			)} not found.`
		);
	}

	return (
		<Layout darkMenu={true}>
			<SinglePost
				headerImage={
					post.frontmatter.featuredImage.childImageSharp
						.gatsbyImageData
				}
				title={post?.frontmatter?.title || ''}
				subtitle={post?.frontmatter?.subtitle}
				content={post?.html || ''}
				meta={post?.frontmatter?.date}
				linkBackName={'Miscellany'}
				linkBackURL={'/miscellany'}
				next={next}
				prev={prev}
			/>
		</Layout>
	);
};

export const Head: HeadFC<Queries.BlogPostBySlugQuery> = ({ data }) => (
	<SEO
		title={data.markdownRemark?.frontmatter?.title || ''}
		description={
			data.markdownRemark?.frontmatter?.description ||
			data.markdownRemark?.excerpt ||
			''
		}
	/>
);

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
						gatsbyImageData(
							width: 540
							layout: CONSTRAINED
							quality: 70
						)
					}
				}
			}
		}
	}
`;
