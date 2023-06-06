import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import * as styles from './StructHeader.module.scss';
import NavLink from '../StructNavLink';
import { MdHome } from 'react-icons/md';

type HeaderProps = {
	isHome?: boolean;
	darkMenu?: boolean;
	miniMenu?: boolean;
};

const Header: React.FC<HeaderProps> = ({
	isHome = false,
	darkMenu = false,
	miniMenu = false,
}) => {
	const navigationData = useStaticQuery<Queries.NavigationItemsQuery>(graphql`
		query NavigationItems {
			allMarkdownRemark(
				filter: { fields: { sourceInstanceName: { eq: "navigation" } } }
			) {
				edges {
					node {
						frontmatter {
							title
							order
							headerText
							subHeaderText
							imageAltText
							imageBrightness
							featuredImage {
								childImageSharp {
									gatsbyImageData(
										width: 800
										layout: CONSTRAINED
									)
								}
							}
						}
					}
				}
			}
		}
	`);

	const { edges: navItems } = navigationData.allMarkdownRemark;
	const sortedNavItems = [...navItems].sort(
		(a, b) =>
			(a?.node?.frontmatter?.order || 0) -
			(b?.node?.frontmatter?.order || 0)
	);

	const menuBarLineClass = darkMenu
		? `${styles.menuBarLine} ${styles.menuBarLineDark}`
		: styles.menuBarLine;

	let menuClass = styles.menuButton;
	if (darkMenu) {
		menuClass += ` ${styles.menuButtonDark}`;
	}
	if (miniMenu) {
		menuClass += ` ${styles.menuButtonMini}`;
	}

	return (
		<header className={styles.header}>
			<input
				type="checkbox"
				name="toggle"
				id="menu"
				className={styles.menuInput}
			/>
			<label htmlFor="menu" className={menuClass}>
				<span className={styles.menuBars}>
					<span className={menuBarLineClass}></span>
					<span className={menuBarLineClass}></span>
					<span className={menuBarLineClass}></span>
				</span>
				<span className={styles.menuText}>
					<span className={styles.menuTextOpen}>Menu</span>
					<span className={styles.menuTextClose}>Close</span>
				</span>
			</label>

			<div className={styles.overlayNavigation}>
				<nav className={styles.nav}>
					{sortedNavItems.map(({ node: { frontmatter } }, i) => {
						return (
							<NavLink
								key={frontmatter?.title || i}
								linkTo={`/${frontmatter?.title || ''}`}
								headerText={frontmatter?.headerText || ''}
								subHeaderText={frontmatter?.subHeaderText || ''}
								image={
									frontmatter?.featuredImage?.childImageSharp
										?.gatsbyImageData
								}
								brightness={frontmatter?.imageBrightness}
							/>
						);
					})}
					{!isHome && (
						<Link to="/" className={styles.homeButtonLink}>
							<span className={styles.homeButtonText}>Home</span>
							<MdHome className={styles.homeButtonIcon} />
						</Link>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
