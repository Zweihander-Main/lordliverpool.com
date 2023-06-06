import React from 'react';
import * as styles from './IndexBookInfo.module.scss';
import { StaticImage } from 'gatsby-plugin-image';
import { useStaticQuery, graphql, Link } from 'gatsby';
// import Link from 'gatsby-link';
import ModalButton from '../RetailersButton';

const BookInfo: React.FC = () => {
	const bookInfoData = useStaticQuery<Queries.BookInfoQuery>(graphql`
		query BookInfo {
			markdownRemark(fields: { slug: { eq: "/pages/home__bookInfo" } }) {
				html
			}
		}
	`);

	return (
		<section className={styles.bookInfo}>
			<StaticImage
				alt="Book cover for Britain's Greatest Prime Minister"
				src="../../images/bgpmbookcover.png"
				className={styles.bookDisplay}
				formats={['auto', 'webp', 'avif']}
				imgStyle={{
					width: 'auto',
					objectFit: 'contain',
					margin: '0 auto',
					right: '0',
					background: 'radial-gradient(#f5ece1 0%, transparent 72%)',
					aspectRatio: 'auto 791 / 922',
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
					Endorsements and Reviews
				</Link>
			</article>
		</section>
	);
};

export default BookInfo;
