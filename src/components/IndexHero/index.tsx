import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import ModalButton from '../../components/RetailersButton';

import * as styles from './IndexHero.module.scss';

const Hero: React.FC = () => {
	const heroImageData = useStaticQuery<Queries.HeroImageQuery>(graphql`
		query HeroImage {
			heroImage: file(relativePath: { eq: "liverpoolherobg.png" }) {
				childImageSharp {
					gatsbyImageData(layout: FULL_WIDTH, quality: 90)
				}
			}
		}
	`);

	if (!heroImageData.heroImage?.childImageSharp?.gatsbyImageData) {
		throw new Error('No file found for liverpoolherobg.png');
	}

	return (
		<section className={styles.hero}>
			<GatsbyImage
				alt="Britain's Greatest Prime Minister: Lord Liverpool"
				image={heroImageData.heroImage.childImageSharp.gatsbyImageData}
				className={styles.heroImage}
				style={{
					position: 'absolute',
				}}
				imgStyle={{
					objectFit: 'contain',
					objectPosition: 'center 40%',
				}}
			/>
			<h1 className={styles.mainTitle}>
				Britain’s Greatest
				<br />
				Prime Minister
			</h1>
			<h2 className={styles.subTitle}>Lord Liverpool</h2>
			<span className={styles.arrow}>
				<span></span>
			</span>
			<div className={styles.retailers}>
				{/* <h6 className={styles.availableText}></h6> */}
				<ModalButton />
			</div>
		</section>
	);
};

export default Hero;
