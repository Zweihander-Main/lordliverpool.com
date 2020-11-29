import React from 'react';
import styles from './card.module.scss';
import Img from 'gatsby-image';
import { Link } from 'gatsby';
import { AppLocState } from 'types';

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
	cardContainerWrapperRef?: React.RefObject<HTMLElement>;
};

const Card = React.forwardRef<HTMLElement | null, CardProps>(
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
					<div>
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

const memoizedCard = React.memo(Card, (prevProps, nextProps) => {
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
