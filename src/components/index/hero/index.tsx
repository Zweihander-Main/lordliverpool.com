import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import ModalButton from 'components/shared/retailers/retailersButton';

import styles from './hero.module.scss';

const Hero: React.FC = () => {
	const heroImageData = useStaticQuery<GatsbyTypes.HeroImageQuery>(graphql`
		query HeroImage {
			file(relativePath: { eq: "liverpoolherobg.png" }) {
				childImageSharp {
					fluid(maxWidth: 800) {
						...GatsbyImageSharpFluid
					}
				}
			}
		}
	`);

	if (!heroImageData.file?.childImageSharp?.fluid) {
		throw new Error('No file found for liverpoolherobg.png');
	}

	return (
		<BackgroundImage
			className={styles.hero}
			fluid={heroImageData.file.childImageSharp.fluid}
			Tag={'section'}
		>
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
				<h6 className={styles.availableText}>Available November 26</h6>
				<ModalButton />
			</div>
		</BackgroundImage>
	);
};

export default Hero;
