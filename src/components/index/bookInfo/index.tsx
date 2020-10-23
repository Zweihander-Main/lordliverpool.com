import React from 'react';
import styles from './bookInfo.module.scss';
import Img from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';
import Link from 'gatsby-link';
import ModalButton from 'components/shared/retailers/retailersButton';

const BookInfo: React.FC = () => {
	const bookInfoData = useStaticQuery<GatsbyTypes.BookInfoQuery>(graphql`
		query BookInfo {
			file(relativePath: { eq: "bookcover.png" }) {
				childImageSharp {
					fluid(maxWidth: 950) {
						...GatsbyImageSharpFluid
					}
				}
			}
			markdownRemark(fields: { slug: { eq: "/pages/home__bookInfo" } }) {
				html
			}
		}
	`);

	if (!bookInfoData.file?.childImageSharp?.fluid) {
		throw new Error('There is no file match for bookcover.png');
	}

	return (
		<section className={styles.bookInfo}>
			<Img
				className={styles.bookDisplay}
				fluid={bookInfoData.file.childImageSharp.fluid}
				imgStyle={{
					width: 'auto',
					objectFit: 'contain',
					margin: '0 auto',
					right: '0',
				}}
			/>
			<article className={styles.info}>
				<h1 className={styles.header}>
					Britain’s Greatest Prime Minister
				</h1>
				<h2 className={styles.subHeader}>Lord Liverpool</h2>
				<h3 className={styles.authorHeader}>
					By{' '}
					<Link to="/author/" className={styles.authorLink}>
						Martin Hutchinson
					</Link>
				</h3>
				{bookInfoData?.markdownRemark?.html && (
					<div
						className={styles.text}
						dangerouslySetInnerHTML={{
							__html: bookInfoData.markdownRemark.html,
						}}
					/>
				)}
				<ModalButton />
				<Link to="/book/" className={styles.moreInfo}>
					More info
				</Link>
			</article>
		</section>
	);
};

export default BookInfo;
