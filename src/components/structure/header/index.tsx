import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import styles from './header.module.scss';
import NavLink from './navLink';
import { MdHome } from 'react-icons/md';

type HeaderProps = {
	isHome?: boolean;
};

const Header: React.FC<HeaderProps> = ({ isHome }) => {
	const imageData = useStaticQuery<GatsbyTypes.MenuImagesQuery>(graphql`
		query MenuImages {
			chronology: file(
				relativePath: {
					eq: "Charles_Jenkinson,_1st_Earl_of_Liverpool_by_George_Romney.jpg"
				}
			) {
				childImageSharp {
					fluid(maxWidth: 800) {
						...GatsbyImageSharpFluid
					}
				}
			}
			contenders: file(
				relativePath: { eq: "William_Pitt_the_Younger.jpg" }
			) {
				childImageSharp {
					fluid(maxWidth: 800) {
						...GatsbyImageSharpFluid
					}
				}
			}
			miscellany: file(
				relativePath: {
					eq: "The_House_of_Commons_1793-94_by_Karl_Anton_Hickel.jpg"
				}
			) {
				childImageSharp {
					fluid(maxWidth: 800) {
						...GatsbyImageSharpFluid
					}
				}
			}
			author: file(relativePath: { eq: "Martin Hutchinson.jpg" }) {
				childImageSharp {
					fluid(maxWidth: 800) {
						...GatsbyImageSharpFluid
					}
				}
			}
			book: file(relativePath: { eq: "Robert Banks Jenkinson.jpg" }) {
				childImageSharp {
					fluid(maxWidth: 800) {
						...GatsbyImageSharpFluid
					}
				}
			}
		}
	`);

	const images = Object.keys(imageData);
	images.forEach((imageKey) => {
		if (
			!(
				imageData[imageKey] &&
				imageData[imageKey]?.childImageSharp?.fluid
			)
		) {
			throw new Error(`${imageKey} menu item background image not found`);
		}
	});
	const imageDataArray = images.map(
		(imageKey) => imageData[imageKey].childImageSharp.fluid
	);
	const [chronology, contenders, miscellany, author, book] = imageDataArray;

	const authorBackgroundStack = [
		'linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))',
		author,
	];
	const chronologyBackgroundStack = [
		'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1))',
		chronology,
	];
	const contendersBackgroundStack = [
		'linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2))',
		contenders,
	];

	// TODO Add in home link when not home
	// TODO Add in other images
	// TODO Menu color based on section overlapping
	// TODO Menu color based on navlink hover
	// TODO Animation
	// TODO Check menu lines on large font screen
	// TODO viewport font size fallback

	return (
		<header className={styles.header}>
			<input
				type="checkbox"
				name="toggle"
				id="menu"
				className={styles.menuInput}
			/>
			<label htmlFor="menu" className={styles.menuButton}>
				<div className={styles.menuBars}>
					<div className={styles.menuBarLine}></div>
					<div className={styles.menuBarLine}></div>
					<div className={styles.menuBarLine}></div>
				</div>
				<span className={styles.menuText}>
					<span className={styles.menuTextOpen}>Menu</span>
					<span className={styles.menuTextClose}>Close</span>
				</span>
			</label>

			<div className={styles.overlayNavigation}>
				<nav className={styles.nav}>
					<NavLink
						linkTo={'/chronology/'}
						headerText={'Chronology'}
						subHeaderText={'The Life and Colleagues'}
						fluidData={chronologyBackgroundStack}
					/>
					<NavLink
						linkTo={'/contenders/'}
						headerText={'Contenders'}
						subHeaderText={'For Greatest Prime Minister'}
						fluidData={contendersBackgroundStack}
					/>
					<NavLink
						linkTo={'/miscellany/'}
						headerText={'Miscellany'}
						subHeaderText={'On All Things Liverpool'}
						fluidData={miscellany}
					/>
					<NavLink
						linkTo={'/author/'}
						headerText={'Author'}
						subHeaderText={'About Martin Hutchinson'}
						fluidData={authorBackgroundStack}
					/>
					<NavLink
						linkTo={'/book/'}
						headerText={'Book'}
						subHeaderText={'Reviews and Information'}
						fluidData={book}
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
