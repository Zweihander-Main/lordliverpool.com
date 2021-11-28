import React from 'react';
import * as styles from './footer.module.scss';

const Footer: React.FC = () => {
	return (
		<footer className={styles.footer}>
			© {new Date().getFullYear()} Martin Hutchinson
		</footer>
	);
};

export default Footer;
