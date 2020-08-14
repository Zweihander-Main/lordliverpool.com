import React from 'react';
import Header from 'components/structure/header';
import Footer from 'components/structure/footer';
import 'styles/base.global.scss';
import styles from './layout.module.scss';

type LayoutProps = {
	isHome?: boolean;
};

const Layout: React.FC<
	LayoutProps & React.PropsWithChildren<Record<string, unknown>>
> = ({ children, isHome }) => {
	return (
		<React.Fragment>
			<Header isHome={isHome} />
			<div className={styles.content}>
				<main>{children}</main>
				<Footer />
			</div>
		</React.Fragment>
	);
};
// TODO make sure nojs works
export default Layout;
