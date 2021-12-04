import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import SinglePost from 'components/shared/singlePost';
import { TemplatePageContext } from '../types';

const ContenderPostTemplate: React.FC<
	PageProps<GatsbyTypes.ContenderPostBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { prev, next } = pageContext;

	return (
		<Layout darkMenu={true}>
			<SEO
				title={post?.frontmatter?.title || ''}
				description={
					post?.frontmatter?.description || post?.excerpt || ''
				}
			/>

			<SinglePost
				headerImage={
					post?.frontmatter?.featuredImage?.childImageSharp
						?.gatsbyImageData
				}
				title={post?.frontmatter?.title || ''}
				content={post?.html || ''}
				extraHeaderText={post?.frontmatter?.displayDate}
				linkBackName={'Contenders'}
				linkBackURL={'/contenders'}
				next={next}
				prev={prev}
				id={post?.id}
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
			excerpt(pruneLength: 160)
			html
			id
			frontmatter {
				title
				displayDate
				description
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
