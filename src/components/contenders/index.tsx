import React from 'react';
import styles from './contenders.module.scss';
import { useStaticQuery, graphql, Link, useScrollRestoration } from 'gatsby';
import Img from 'gatsby-image';

const Contenders: React.FC = () => {
	const blogRollData = useStaticQuery<
		GatsbyTypes.ContendersQueryQuery
	>(graphql`
		query ContendersQuery {
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___date] }
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
									fluid(maxWidth: 800, grayscale: true) {
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
	const contendersMenuScrollRestoration = useScrollRestoration(
		`contenders-menu`
	);

	const [selected, setSelected] = React.useState(contenders[0].node.id || '');
	const selectedContender = contenders.find((c) => c.node.id === selected);

	// if (
	// 	!selectedContender?.node.frontmatter?.featuredImage?.childImageSharp
	// 		?.fluid
	// ) {
	// 	throw new Error('Missing image for currently selected Prime Minister');
	// }

	//TODO Switch back

	//TODO save selected contenders for scroll restoration/session storage

	return (
		<section className={styles.contenders}>
			<figure className={styles.pictureContainer}>
				{selectedContender?.node?.frontmatter?.featuredImage
					?.childImageSharp?.fluid && (
					<Img
						className={styles.picture}
						imgStyle={{
							objectPosition: 'center 25%',
						}}
						fluid={
							selectedContender.node.frontmatter.featuredImage
								.childImageSharp.fluid
						}
						onLoad={() => {
							console.log('load');
						}}
						onStartLoad={() => {
							console.log('startload');
						}}
					/>
				)}
				<figcaption className={styles.caption}>
					<h2 className={styles.dates}>
						{selectedContender.node.frontmatter.displayDate}
					</h2>
					<h1 className={styles.name}>
						{selectedContender.node.frontmatter.title}
					</h1>
				</figcaption>
			</figure>
			<div className={styles.menu} {...contendersMenuScrollRestoration}>
				<h1>Contenders for Greatest</h1>
				<ul className={styles.menuList}>
					{contenders &&
						contenders.map(({ node: contender }) => {
							return contender?.fields?.slug ? (
								<li key={contender.id}>
									<Link
										onMouseEnter={() =>
											setSelected(contender.id)
										}
										to={contender.fields.slug}
										className={
											contender.id === selected
												? `${styles.link} ${styles.selected}`
												: styles.link
										}
									>
										{contender?.frontmatter?.title}
									</Link>
								</li>
							) : null;
						})}
				</ul>
			</div>
		</section>
	);
};

export default Contenders;
