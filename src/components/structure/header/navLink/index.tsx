import React from 'react';
import { Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import * as styles from './navLink.module.scss';

type NavLinkProps = {
	linkTo: string;
	fluidData: FluidObject;
	headerText: string;
	subHeaderText: string;
	brightness?: number;
};

const NavLink: React.FC<NavLinkProps> = ({
	linkTo,
	fluidData,
	headerText,
	subHeaderText,
	brightness,
}) => (
	<Link className={styles.navLink} to={linkTo}>
		<div className={styles.navLinkContainer}>
			<Img
				fluid={fluidData}
				className={styles.navLinkImage}
				style={{
					position: 'absolute',
				}}
				imgStyle={{
					filter: brightness
						? `brightness(${brightness}%)`
						: undefined,
					objectPosition: 'center 23%',
				}}
			/>
			<h3 className={styles.navHeader}>{headerText}</h3>
			<h4 className={styles.navSubHeader}>{subHeaderText}</h4>
		</div>
	</Link>
);

export default NavLink;
