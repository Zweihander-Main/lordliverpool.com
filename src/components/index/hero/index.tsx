import React from 'react';

import styles from './hero.module.scss';

const Hero: React.FC = () => {
	return (
		<React.Fragment>
			<h1 className={styles.mainTitle}>
				Britain&apos;s Greatest Prime Minister
			</h1>
			<h2 className={styles.subTitle}>Lord Liverpool</h2>
		</React.Fragment>
	);
};

export default Hero;
