import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import * as styles from './header.module.scss';
import NavLink from './navLink';
import { MdHome } from 'react-icons/md';

type HeaderProps = {
	isHome?: boolean;
	darkMenu?: boolean;
	miniMenu?: boolean;
};

// TODO: Explore staticimage for this or putting it in the CMS
const Header: React.FC<HeaderProps> = ({
	isHome = false,
	darkMenu = false,
	miniMenu = false,
}) => {
	const imageData = useStaticQuery<Queries.MenuImagesQuery>(graphql`
		query MenuImages {
			chronology: file(
				relativePath: {
					eq: "Charles_Jenkinson,_1st_Earl_of_Liverpool_by_George_Romney.jpg"
				}
			) {
				childImageSharp {
					gatsbyImageData(width: 800, layout: CONSTRAINED)
				}
			}
			contenders: file(
				relativePath: { eq: "William_Pitt_the_Younger.jpg" }
			) {
				childImageSharp {
					gatsbyImageData(width: 800, layout: CONSTRAINED)
				}
			}
			miscellany: file(
				relativePath: {
					eq: "The_House_of_Commons_1793-94_by_Karl_Anton_Hickel.jpg"
				}
			) {
				childImageSharp {
					gatsbyImageData(width: 800, layout: CONSTRAINED)
				}
			}
			author: file(relativePath: { eq: "Martin Hutchinson.jpg" }) {
				childImageSharp {
					gatsbyImageData(width: 800, layout: CONSTRAINED)
				}
			}
			book: file(relativePath: { eq: "Robert Banks Jenkinson.jpg" }) {
				childImageSharp {
					gatsbyImageData(width: 800, layout: CONSTRAINED)
				}
			}
		}
	`);

	const images = Object.keys(imageData) as [
		'chronology',
		'contenders',
		'miscellany',
		'author',
		'book'
	];
	images.forEach((imageKey) => {
		if (
			!(
				imageData[imageKey] &&
				imageData[imageKey]?.childImageSharp?.gatsbyImageData
			)
		) {
			throw new Error(`${imageKey} menu item background image not found`);
		}
	});
	const imageDataArray = images.map(
		(imageKey) => imageData[imageKey]?.childImageSharp?.gatsbyImageData
	);
	const [chronology, contenders, miscellany, author, book] = imageDataArray;

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
				<div className={styles.menuBars}>
					<div className={menuBarLineClass}></div>
					<div className={menuBarLineClass}></div>
					<div className={menuBarLineClass}></div>
				</div>
				<span className={styles.menuText}>
					<span className={styles.menuTextOpen}>Menu</span>
					<span className={styles.menuTextClose}>Close</span>
				</span>
			</label>

			<div className={styles.overlayNavigation}>
				<nav className={styles.nav}>
					<NavLink
						linkTo={'/chronology'}
						headerText={'Chronology'}
						subHeaderText={'The Life and Colleagues'}
						image={chronology}
						brightness={90}
					/>
					<NavLink
						linkTo={'/contenders'}
						headerText={'Contenders'}
						subHeaderText={'For Greatest Prime Minister'}
						image={contenders}
						brightness={80}
					/>
					<NavLink
						linkTo={'/miscellany'}
						headerText={'Miscellany'}
						subHeaderText={'On All Things Liverpool'}
						image={miscellany}
					/>
					<NavLink
						linkTo={'/author'}
						headerText={'Author'}
						subHeaderText={'About Martin Hutchinson'}
						image={author}
						brightness={70}
					/>
					<NavLink
						linkTo={'/book'}
						headerText={'Book'}
						subHeaderText={'Reviews and Information'}
						image={book}
					/>
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
