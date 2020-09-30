import React from 'react';
import styles from './card.module.scss';
import Img from 'gatsby-image';
import { Link } from 'gatsby';

type CardProps = {
	show: boolean;
	featuredImage?: GatsbyTypes.Maybe<
		Pick<
			GatsbyTypes.ImageSharpFluid,
			'sizes' | 'base64' | 'aspectRatio' | 'src' | 'srcSet'
		>
	>;
	title?: string;
	isFullArticle: boolean;
	slug?: string;
	text?: string;
	displayDate?: string;
};

const Card: React.FC<CardProps> = ({
	show,
	featuredImage,
	title,
	isFullArticle,
	slug,
	text,
	displayDate,
}) => {
	return (
		<article className={`${styles.card} ${show ? '' : styles.hidden}`}>
			<div className={styles.inner}>
				{featuredImage && (
					<Img
						className={styles.image}
						imgStyle={{
							objectPosition: 'center 10%',
						}}
						fluid={featuredImage}
					/>
				)}
				{title && (
					<h2
						className={
							featuredImage
								? styles.header
								: `${styles.header} ${styles.headerNoImage}`
						}
					>
						{isFullArticle && slug ? (
							<Link to={slug} className={styles.titleLink}>
								{title}
							</Link>
						) : (
							title
						)}
					</h2>
				)}
				{text && <p className={styles.text}>{text}</p>}
			</div>
			{displayDate && (
				<span className={styles.displayDate}>{displayDate}</span>
			)}
		</article>
	);
};

export default Card;
