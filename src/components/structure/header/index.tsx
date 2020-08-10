import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import styles from './header.module.scss';
import NavLink from './navLink';

type ImageProps = {
	[key: string]: {
		childImageSharp: {
			fluid: FluidObject;
		};
	};
};

const Header: React.FC = () => {
	const imageData = useStaticQuery<ImageProps>(graphql`
		query {
			chronology: file(relativePath: { eq: "liverpoolherobg.png" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
			contenders: file(relativePath: { eq: "liverpoolherobg.png" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
			miscellany: file(relativePath: { eq: "liverpoolherobg.png" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
			author: file(relativePath: { eq: "Martin Hutchinson.jpg" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
			book: file(relativePath: { eq: "Robert Banks Jenkinson.jpg" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
		}
	`);

	const { chronology, contenders, miscellany, author, book } = imageData;

	const authorBackgroundStack = [
		'linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))',
		author.childImageSharp.fluid,
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
						linkTo={''}
						headerText={'Chronology'}
						subHeaderText={'The Life and Times'}
						fluidData={chronology.childImageSharp.fluid}
					/>
					<NavLink
						linkTo={''}
						headerText={'Contenders'}
						subHeaderText={'For Greatest Prime Minister'}
						fluidData={contenders.childImageSharp.fluid}
					/>
					<NavLink
						linkTo={''}
						headerText={'Miscellany'}
						subHeaderText={'On All Things Liverpool'}
						fluidData={miscellany.childImageSharp.fluid}
					/>
					<NavLink
						linkTo={''}
						headerText={'Author'}
						subHeaderText={'About Martin Hutchinson'}
						fluidData={authorBackgroundStack}
					/>
					<NavLink
						linkTo={''}
						headerText={'Book'}
						subHeaderText={'Reviews and Information'}
						fluidData={book.childImageSharp.fluid}
					/>
				</nav>
			</div>
		</header>
	);
};

export default Header;
