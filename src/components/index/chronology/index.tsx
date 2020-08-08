import React from 'react';
import styles from './chronology.module.scss';

const Chronology: React.FC = () => {
	return (
		<section className={styles.chronology}>
			<h1 className={styles.title}>The Life and Times</h1>
			<span className={styles.line}></span>
			<div className={styles.timeline}>
				<div className={styles.chronoItem}>
					<p className={styles.chronoText}>
						<strong>July 7</strong>
						<br /> The birth of Robert Jenkinson.
					</p>
					<div className={styles.chronoPoint}></div>
					<date className={styles.chronoYear} datetime="1770">
						1770
					</date>
				</div>
			</div>
		</section>
	);
};

export default Chronology;
