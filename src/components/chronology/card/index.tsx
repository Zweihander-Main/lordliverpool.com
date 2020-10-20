import React from 'react';
import styles from './card.module.scss';
import Img from 'gatsby-image';
import { Link } from 'gatsby';

type CardProps = {
	show: boolean;
	animate: boolean;
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
	selectedCategory: string;
	containerScrollPos?: number;
};

const Card: React.FC<CardProps> = ({
	show,
	animate,
	selectedCategory,
	featuredImage,
	title,
	isFullArticle,
	slug,
	text,
	displayDate,
	containerScrollPos,
}) => {
	// TODO now doesn't work - should pass in function to pull in or something else
	return (
		<article
			className={`${styles.card} ${animate ? styles.animate : ''} ${
				show ? '' : styles.hidden
			}`}
		>
			<div className={styles.inner}>
				{featuredImage &&
					(isFullArticle && slug ? (
						<Link
							to={slug}
							className={styles.titleLink}
							state={{
								upperState: selectedCategory,
								scrollPos: containerScrollPos,
							}}
						>
							<Img
								className={styles.image}
								imgStyle={{
									objectPosition: 'center 10%',
								}}
								fluid={featuredImage}
							/>
						</Link>
					) : (
						<Img
							className={styles.image}
							imgStyle={{
								objectPosition: 'center 10%',
							}}
							fluid={featuredImage}
						/>
					))}
				{title && (
					<h2
						className={
							featuredImage
								? styles.header
								: `${styles.header} ${styles.headerNoImage}`
						}
					>
						{isFullArticle && slug ? (
							<Link
								to={slug}
								className={styles.titleLink}
								state={{
									upperState: selectedCategory,
									scrollPos: containerScrollPos,
								}}
							>
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

// export default Card;

const memoizedCard = React.memo(Card, (prevProps, nextProps) => {
	if (
		prevProps.show !== nextProps.show ||
		prevProps.animate !== nextProps.animate
	) {
		return false;
	}
	return true;
});

export default memoizedCard;
