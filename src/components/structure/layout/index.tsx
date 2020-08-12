import React from 'react';
import Header from 'components/structure/header';
import Footer from 'components/structure/footer';
import 'styles/base.global.scss';
import styles from './layout.module.scss';

const Layout: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
	children,
}) => {
	return (
		<React.Fragment>
			<Header />
			<div className={styles.content}>
				<main>{children}</main>
				<Footer />
			</div>
		</React.Fragment>
	);
};

export default Layout;
