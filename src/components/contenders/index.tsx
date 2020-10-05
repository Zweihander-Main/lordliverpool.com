import React from 'react';
import styles from './contenders.module.scss';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';

const Contenders: React.FC = () => {
	const blogRollData = useStaticQuery<
		GatsbyTypes.ContendersQueryQuery
	>(graphql`
		query ContendersQuery {
			allMarkdownRemark(
				sort: { order: DESC, fields: [frontmatter___date] }
				filter: { fields: { sourceInstanceName: { eq: "contenders" } } }
			) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							title
							displayDate
							featuredImage {
								childImageSharp {
									fluid(maxWidth: 450) {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
					}
				}
			}
		}
	`);

	const { edges: contenders } = blogRollData.allMarkdownRemark;

	return (
		<div>
			{contenders &&
				contenders.map(({ node: contender }) => {
					return contender?.fields?.slug ? (
						<Link
							key={contender.id}
							to={contender.fields.slug}
							className={styles.link}
						>
							{contender?.frontmatter?.title}
						</Link>
					) : null;
				})}
		</div>
	);
};

export default Contenders;
