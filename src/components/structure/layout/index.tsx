import React from 'react';
import Header from 'components/structure/header';
import Footer from 'components/structure/footer';
import 'styles/base.global.scss';
import styles from './layout.module.scss';

type LayoutProps = {
	isHome?: boolean;
	darkMenu?: boolean;
	showFooter?: boolean;
};

const Layout: React.FC<
	LayoutProps & React.PropsWithChildren<Record<string, unknown>>
> = ({ children, isHome, darkMenu, showFooter = true }) => {
	return (
		<React.Fragment>
			<Header isHome={isHome} darkMenu={darkMenu} />
			<div className={styles.content}>
				<main>{children}</main>
				{showFooter && <Footer />}
			</div>
		</React.Fragment>
	);
};
// TODO make sure nojs works
export default Layout;
