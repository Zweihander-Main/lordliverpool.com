import React from 'react';
import { Link } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import { FluidObject } from 'gatsby-image';
import styles from './navLink.module.scss';

type NavLinkProps = {
	linkTo: string;
	fluidData: FluidObject | Array<string | FluidObject>;
	headerText: string;
	subHeaderText: string;
};

const NavLink: React.FC<NavLinkProps> = ({
	linkTo,
	fluidData,
	headerText,
	subHeaderText,
}) => (
	<Link className={styles.navLink} to={linkTo}>
		<BackgroundImage
			className={styles.navLinkContainer}
			fluid={fluidData}
			Tag={'div'}
		>
			<h3 className={styles.navHeader}>{headerText}</h3>
			<h4 className={styles.navSubHeader}>{subHeaderText}</h4>
		</BackgroundImage>
	</Link>
);

export default NavLink;
