import React from 'react';
import styles from './contenders.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import ContendersImage from './contendersImage';
import ContendersMenu from './contenderMenu';

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

	const [selected, setSelected] = React.useState(contenders[0].node.id || '');
	const selectedContender = contenders.find((c) => c.node.id === selected)
		?.node;

	//TODO save selected contenders for scroll restoration/session storage

	return (
		<section className={styles.contenders}>
			<ContendersImage
				featuredImage={
					selectedContender?.frontmatter?.featuredImage
						?.childImageSharp?.fluid
				}
				displayDate={selectedContender?.frontmatter?.displayDate}
				title={selectedContender?.frontmatter?.title}
				selectedID={selectedContender?.id}
			/>
			<ContendersMenu
				selected={selected}
				setSelected={setSelected}
				contenders={contenders}
			/>
		</section>
	);
};

export default Contenders;
