import React from 'react';
import styles from './retailersModal.module.scss';
import ModalContext from 'contexts/ModalContext';
import useJS from 'hooks/useJS';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';

const RetailersModal: React.FC = ({}) => {
	const retailersData = useStaticQuery<
		GatsbyTypes.RetailersInfoQuery
	>(graphql`
		query RetailersInfo {
			allMarkdownRemark(
				filter: { fields: { sourceInstanceName: { eq: "retailers" } } }
			) {
				edges {
					node {
						id
						frontmatter {
							title
							currency
							format
							link
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
			}
		}
	`);

	const { edges: retailers } = retailersData.allMarkdownRemark;

	const { open, toggleModal } = React.useContext(ModalContext);
	const hasJS = useJS();

	const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		toggleModal();
	};

	return (
		<section
			className={
				open ? `${styles.outer} ${styles.isActive}` : styles.outer
			}
			id={'retailers'}
			tabIndex={-1}
			role={'dialog'}
			aria-hidden={true}
		>
			<div className={styles.inner}>
				{retailers &&
					retailers.map(({ node: retailer }) => (
						<div key={retailer.id}>
							<a href={retailer?.frontmatter?.link || ''}>
								{retailer?.frontmatter?.featuredImage
									?.childImageSharp?.fluid && (
									<Img
										fluid={
											retailer.frontmatter.featuredImage
												.childImageSharp.fluid
										}
									/>
								)}
								{retailer?.frontmatter?.title}
							</a>
						</div>
					))}
			</div>

			<a
				href={hasJS ? '' : '#!'}
				onClick={onClick}
				className={styles.close}
				title="Close this modal"
			>
				?
			</a>
		</section>
	);
};

export default RetailersModal;
