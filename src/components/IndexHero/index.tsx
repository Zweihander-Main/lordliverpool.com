import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import ModalButton from '../../components/RetailersButton';

import * as styles from './IndexHero.module.scss';

const Hero: React.FC = () => {
	return (
		<section className={styles.hero}>
			<StaticImage
				alt="Britain's Greatest Prime Minister: Lord Liverpool"
				src="../../images/liverpoolherobg.png"
				loading={'eager'}
				layout="fullWidth"
				quality={90}
				className={styles.heroImage}
				aspectRatio={1571 / 2164}
				style={{
					position: 'absolute',
				}}
				imgStyle={{
					objectFit: 'contain',
					objectPosition: 'center 40%',
					aspectRatio: 'auto 1571 / 2164',
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
