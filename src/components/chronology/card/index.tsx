import React, { forwardRef, memo, useCallback } from 'react';
import * as styles from './card.module.scss';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Link } from 'gatsby';

type CardProps = {
	show: boolean;
	animate: boolean;
	featuredImage?: IGatsbyImageData;
	title?: string;
	isFullArticle: boolean;
	slug?: string;
	text?: string;
	displayDate?: string;
};

const Card = forwardRef<HTMLElement | null, CardProps>(
	(
		{
			show,
			animate,
			featuredImage,
			title,
			isFullArticle,
			slug,
			text,
			displayDate,
		},
		ref
	) => {
		const cardImage = useCallback(
			(image: IGatsbyImageData) => (
				<GatsbyImage
					alt={title || 'Image for Card'}
					image={image}
					className={styles.image}
					objectFit={'contain'}
					imgStyle={{
						objectPosition: 'center 10%',
					}}
				/>
			),
			[title]
		);

		return (
			<article
				className={`${styles.card} ${animate ? styles.animate : ''} ${
					show ? '' : styles.hidden
				}`}
				ref={ref}
			>
				<div className={styles.inner}>
					{featuredImage &&
						(isFullArticle && slug ? (
							<Link
								to={slug}
								className={styles.titleLink}
								aria-label={title}
							>
								{cardImage(featuredImage)}
							</Link>
						) : (
							cardImage(featuredImage)
						))}
					<div className={styles.textContainer}>
						{title && (
							<h1
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
									>
										{title}
									</Link>
								) : (
									title
								)}
							</h1>
						)}
						{text && <p className={styles.text}>{text}</p>}
					</div>
				</div>
				{displayDate && (
					<span className={styles.displayDate}>{displayDate}</span>
				)}
			</article>
		);
	}
);

Card.displayName = 'Card';

const memoizedCard = memo(Card, (prevProps, nextProps) => {
	if (
		prevProps.show !== nextProps.show ||
		prevProps.animate !== nextProps.animate ||
		prevProps.ref !== nextProps.ref
	) {
		return false;
	}
	return true;
});

export default memoizedCard;
