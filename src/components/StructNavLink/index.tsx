import React, { memo } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import * as styles from './StructNavLink.module.scss';

type NavLinkProps = {
	linkTo: string;
	image: IGatsbyImageData | undefined;
	headerText: string;
	subHeaderText: string;
	brightness?: number;
};

const NavLink: React.FC<NavLinkProps> = ({
	linkTo,
	image,
	headerText,
	subHeaderText,
	brightness,
}) => (
	<Link className={styles.navLink} to={linkTo}>
		<div className={styles.navLinkContainer}>
			{image && (
				<GatsbyImage
					alt={headerText}
					image={image}
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
			)}
			<h3 className={styles.navHeader}>{headerText}</h3>
			<h4 className={styles.navSubHeader}>{subHeaderText}</h4>
		</div>
	</Link>
);

// Never changes after initial render
const MemoizedNavLink = memo(NavLink, () => true);

export default MemoizedNavLink;
