import React from 'react';
import { Link } from 'gatsby';

import styles from './header.module.scss';

const Header: React.FC = () => (
	<header className={styles.header}>
		<input
			type="radio"
			name="toggle"
			id="menu"
			className={styles.menuInput}
		/>
		<label htmlFor="menu" className={styles.menuButton}>
			<div className={styles.menuBars}>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<span className={styles.menu}>Menu</span>
		</label>

		<div class={styles.overlayNavigation}>
			<input
				type="radio"
				name="toggle"
				id="nav"
				className={styles.navInput}
			/>
			<label htmlFor="nav" className={styles.closeButton}>
				X
			</label>
			<nav className={styles.nav}>
				<Link className={styles.navLink} to="">
					<div className={styles.navLinkContainer}>
						<h3 className={styles.navHeader}>Chronology</h3>
						<h4 className={styles.navSubHeader}>
							The Life and Times
						</h4>
					</div>
				</Link>
				<Link className={styles.navLink} to="">
					<div className={styles.navLinkContainer}>
						<h3 className={styles.navHeader}>Contenders</h3>
						<h4 className={styles.navSubHeader}>
							For Greatest Prime Minister
						</h4>
					</div>
				</Link>
				<Link className={styles.navLink} to="">
					<div className={styles.navLinkContainer}>
						<h3 className={styles.navHeader}>Miscellany</h3>
						<h4 className={styles.navSubHeader}>
							On All Things Liverpool
						</h4>
					</div>
				</Link>
				<Link className={styles.navLink} to="">
					<div className={styles.navLinkContainer}>
						<h3 className={styles.navHeader}>Author</h3>
						<h4 className={styles.navSubHeader}>
							About Martin Hutchinson
						</h4>
					</div>
				</Link>
				<Link className={styles.navLink} to="">
					<div className={styles.navLinkContainer}>
						<h3 className={styles.navHeader}>Book</h3>
						<h4 className={styles.navSubHeader}>
							Information and Reviews
						</h4>
					</div>
				</Link>
			</nav>
		</div>
	</header>
);

export default Header;
