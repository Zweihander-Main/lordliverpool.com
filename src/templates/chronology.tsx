import React, { useContext, useEffect } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import SinglePost from '../components/SinglePost';
import { TemplatePageContext } from '../types';
import ScrollLocContext from '../contexts/ScrollLocContext';

const ChronologyPostTemplate: React.FC<
	PageProps<Queries.ChronologyPostBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { prev, next } = pageContext;

	const id = post?.id;
	const { dispatch } = useContext(ScrollLocContext);
	useEffect(() => {
		if (id) {
			dispatch({ type: 'updateId', payload: id, track: 'chronology' });
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
				subtitle={post?.frontmatter?.card}
				extraHeaderText={post?.frontmatter?.displayDate}
				linkBackName={'Chronology'}
				linkBackURL={'/chronology'}
				next={next}
				prev={prev}
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
			excerpt(pruneLength: 160)
			html
			id
			frontmatter {
				title
				card
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
