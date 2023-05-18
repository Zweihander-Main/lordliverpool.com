import React from 'react';
import * as styles from './bookInfo.module.scss';
import { GatsbyImage } from 'gatsby-plugin-image';
import { useStaticQuery, graphql, Link } from 'gatsby';
// import Link from 'gatsby-link';
import ModalButton from '../../../components/shared/retailers/retailersButton';

const BookInfo: React.FC = () => {
	const bookInfoData = useStaticQuery<Queries.BookInfoQuery>(graphql`
		query BookInfo {
			file(relativePath: { eq: "bookcover.png" }) {
				childImageSharp {
					gatsbyImageData(width: 950, layout: CONSTRAINED)
				}
			}
			markdownRemark(fields: { slug: { eq: "/pages/home__bookInfo" } }) {
				html
			}
		}
	`);

	if (!bookInfoData.file?.childImageSharp?.gatsbyImageData) {
		throw new Error('There is no file match for bookcover.png');
	}

	return (
		<section className={styles.bookInfo}>
			<GatsbyImage
				alt="Book cover for Britain's Greatest Prime Minister"
				image={bookInfoData.file.childImageSharp.gatsbyImageData}
				className={styles.bookDisplay}
				imgStyle={{
					width: 'auto',
					objectFit: 'contain',
					margin: '0 auto',
					right: '0',
					background: 'radial-gradient(#f5ece1 0%, transparent 72%)',
				}}
			/>
			<article className={styles.info}>
				<h1 className={styles.header}>
					Britain’s Greatest Prime Minister
					{/* TODO Break out strings */}
				</h1>
				<h2 className={styles.subHeader}>Lord Liverpool</h2>
				<h3 className={styles.authorHeader}>
					By{' '}
					<Link to="/author" className={styles.authorLink}>
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
				<Link to="/book" className={styles.moreInfo}>
					More info
				</Link>
			</article>
		</section>
	);
};

export default BookInfo;
