import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import { FluidObject } from 'gatsby-image';

import styles from './hero.module.scss';

type HeroImageProps = {
	file: {
		childImageSharp: {
			fluid: FluidObject;
		};
	};
};

const Hero: React.FC = () => {
	const heroImageData = useStaticQuery<HeroImageProps>(graphql`
		query {
			file(relativePath: { eq: "liverpoolherobg.png" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
		}
	`);

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
			<div className={styles.retailers}>Available November</div>
		</BackgroundImage>
	);
};

export default Hero;
