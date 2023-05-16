import React, { forwardRef, memo } from 'react';
import * as styles from './card.module.scss';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Link } from 'gatsby';

type CardImageProps = {
	title: string;
	image: IGatsbyImageData;
};

const CardImage: React.FC<CardImageProps> = ({ title, image }) => {
	return (
		<GatsbyImage
			alt={title || 'Image for Card'}
			image={image}
			className={styles.image}
			objectFit={'contain'}
			imgStyle={{
				objectPosition: 'center 10%',
			}}
		/>
	);
};

// shouldn't ever change
const MemoizedCardImage = memo(CardImage, () => true);

type CardProps = {
	show: boolean;
	animate: boolean;
	featuredImage?: IGatsbyImageData;
	title?: string | null;
	isFullArticle: boolean;
	slug?: string | null;
	text?: string | null;
	displayDate?: string | null;
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
		return (
			<article
				className={`${styles.card} ${animate ? styles.animate : ''} ${
					show ? '' : styles.hidden
				}`}
				ref={ref}
			>
				<div className={styles.inner} tabIndex={0} role={'article'}>
					{featuredImage &&
						(isFullArticle && slug ? (
							<Link
								to={slug}
								className={styles.titleLink}
								aria-label={title as string}
							>
								<MemoizedCardImage
									title={title || 'Image for Card'}
									image={featuredImage}
								/>
							</Link>
						) : (
							<MemoizedCardImage
								title={title || 'Image for Card'}
								image={featuredImage}
							/>
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
