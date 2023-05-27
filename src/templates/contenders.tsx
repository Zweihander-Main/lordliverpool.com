import React, { useContext, useEffect } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import { TemplatePageContext } from '../types';
import ScrollLocContext from '../contexts/ScrollLocContext';

const ContenderPostTemplate: React.FC<
	PageProps<Queries.ContenderPostBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { prev, next } = pageContext;

	const id = post?.id;
	const { dispatch } = useContext(ScrollLocContext);
	useEffect(() => {
		if (id) {
			dispatch({ type: 'updateId', payload: id, track: 'contenders' });
		}
	}, [dispatch, id]);

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
