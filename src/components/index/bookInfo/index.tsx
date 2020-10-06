import React from 'react';
import styles, { bookInfo } from './bookInfo.module.scss';
import Img from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';
import Link from 'gatsby-link';

// TODO Change placeholder text to include bullet points
const BookInfo: React.FC = () => {
	//TODO better naming for images and support for alt ect.
	const bookInfoData = useStaticQuery<GatsbyTypes.BookInfoQuery>(graphql`
		query BookInfo {
			file(relativePath: { eq: "bookcover.png" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
			markdownRemark(fields: { slug: { eq: "/pages/home__bookInfo" } }) {
				id
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
						dangerouslySetInnerHTML={{
							__html: bookInfoData.markdownRemark.html,
						}}
					/>
				)}
			</article>
		</section>
	);
};

export default BookInfo;
