import { Link } from 'gatsby';
import React from 'react';

import styles from './header.module.scss';

type HeaderProps = {
	siteTitle: string;
};

const Header: React.FC<HeaderProps> = ({ siteTitle = '' }) => (
	<header className={styles.header}>
		<div className={styles.titleContainer}>
			<h1 className={styles.title}>
				<Link to="/" className={styles.titleLink}>
					{siteTitle}
				</Link>
			</h1>
		</div>
	</header>
);

export default Header;
