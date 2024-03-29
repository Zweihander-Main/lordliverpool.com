import React from 'react';
import * as styles from './Miscellany.module.scss';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const Miscellany: React.FC = () => {
	const blogRollData = useStaticQuery<Queries.BlogRollQueryQuery>(graphql`
		query BlogRollQuery {
			allMarkdownRemark(
				sort: { frontmatter: { date: DESC } }
				filter: { fields: { sourceInstanceName: { eq: "miscellany" } } }
			) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							title
							subtitle
							featuredImage {
								childImageSharp {
									gatsbyImageData(
										width: 550
										layout: CONSTRAINED
										transformOptions: {
											duotone: {
												highlight: "#bfaaaa"
												shadow: "#260101"
											}
										}
									)
								}
							}
						}
					}
				}
			}
		}
	`);

	const { edges: posts } = blogRollData.allMarkdownRemark;

	return (
		<div className={styles.masonry}>
			{posts &&
				posts.map(({ node: post }) => {
					return post?.fields?.slug ? (
						<Link
							key={post.id}
							to={post.fields.slug}
							className={styles.link}
						>
							<article className={styles.item}>
								{post?.frontmatter?.featuredImage
									?.childImageSharp?.gatsbyImageData && (
									<GatsbyImage
										alt={
											post.frontmatter.title ||
											'Post Image'
										}
										image={
											post.frontmatter.featuredImage
												.childImageSharp.gatsbyImageData
										}
										objectFit={'cover'}
										className={styles.itemImage}
										imgStyle={{
											objectPosition: 'center 25%',
										}}
									/>
								)}
								{post?.frontmatter && (
									<header className={styles.header}>
										<div
											className={styles.headingsContainer}
										>
											<h1 className={styles.title}>
												{post.frontmatter.title}
											</h1>
											{post.frontmatter?.subtitle && (
												<h2 className={styles.subtitle}>
													{post.frontmatter?.subtitle}
												</h2>
											)}
										</div>
									</header>
								)}
							</article>
						</Link>
					) : null;
				})}
		</div>
	);
};

export default Miscellany;
