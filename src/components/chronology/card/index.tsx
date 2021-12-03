import React, { forwardRef, memo, useCallback } from 'react';
import * as styles from './card.module.scss';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import { AppLocState } from 'types';

type CardProps = {
	show: boolean;
	animate: boolean;
	featuredImage?: IGatsbyImageData;
	title?: string;
	isFullArticle: boolean;
	slug?: string;
	text?: string;
	displayDate?: string;
	selectedCategory: string;
	cardContainerWrapperRef?: React.RefObject<HTMLElement>;
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
			selectedCategory,
			cardContainerWrapperRef,
		},
		ref
	) => {
		const passingState: AppLocState = {
			get upperState() {
				return selectedCategory;
			},
			get initialPos() {
				return cardContainerWrapperRef?.current?.scrollTop;
			},
		};

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
			[]
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
								state={passingState}
							>
								{cardImage(featuredImage)}
							</Link>
						) : (
							cardImage(featuredImage)
						))}
					<div className={styles.textContainer}>
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
										state={passingState}
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
		prevProps.selectedCategory !== nextProps.selectedCategory ||
		prevProps.ref !== nextProps.ref
	) {
		return false;
	}
	return true;
});

export default memoizedCard;
