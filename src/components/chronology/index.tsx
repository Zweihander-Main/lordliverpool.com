import React from 'react';
import styles from './chronology.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import useTimelineWidth from 'hooks/useTimelineWidth';
import Timeline from './timeline';
import Card from './card';

const Chronology: React.FC = () => {
	const chronologyData = useStaticQuery<
		GatsbyTypes.ChronologyQueryQuery
	>(graphql`
		query ChronologyQuery {
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___timelineDate] }
				filter: { fields: { sourceInstanceName: { eq: "chronology" } } }
			) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							title
							subtitle
							timelineDate(formatString: "y")
							displayDate
							category
							card
							featuredImage {
								childImageSharp {
									fluid {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
						rawMarkdownBody
					}
				}
			}
		}
	`); // TODO restrain max width of image

	const { edges: cards } = chronologyData.allMarkdownRemark;
	const pulledInCategories = cards
		.map((c) => c?.node.frontmatter?.category || '')
		.filter((value, index, self) => self.indexOf(value) === index)
		.filter((value) => value && value !== '');
	const categories = ['all', ...pulledInCategories];

	const [selectedCategory, setSelectedCategory] = React.useState<
		typeof categories[number]
	>(categories[0]);

	const ticks = (selectedCategory !== categories[0]
		? cards.filter(
				(value) =>
					value?.node?.frontmatter?.category === selectedCategory
		  )
		: cards
	)
		.map((card) => card.node.frontmatter?.timelineDate)
		.filter((year) => typeof year !== 'undefined') as Array<string>; //not cheating, TS won't filter out undefined types

	const cardContainerRef = React.useRef<HTMLDivElement>(null);
	const cardContainerWrapperRef = React.useRef<HTMLDivElement>(null);
	const [viewportWidth, containerWidth, startPos] = useTimelineWidth(
		cardContainerRef,
		cardContainerWrapperRef,
		selectedCategory
	);

	if (cardContainerRef.current) {
		cardContainerRef.current.focus();
	}

	const showMoreBGRight = !(containerWidth + startPos <= viewportWidth);
	const showMoreBGLeft = Math.round(startPos) !== 0;
	const sectionClass = `${styles.chronology} `; /**${
		(showMoreBGLeft && showMoreBGRight)
			? styles.showMoreBgBoth
			: showMoreBGLeft
			? styles.showMoreBgLeft
			: showMoreBGRight
			? styles.showMoreBgRight
			: ''
	}`;**/

	return (
		<section className={sectionClass}>
			<h1 className={styles.chronologyTitle}>Chronology</h1>
			<div className={styles.filterMenu}>
				{categories.map((category) => (
					<h3
						key={category}
						onClick={() => setSelectedCategory(category)}
						className={
							category === selectedCategory
								? `${styles.filterMenuLink} ${styles.selectedLink}`
								: styles.filterMenuLink
						}
					>
						{category.charAt(0).toUpperCase() + category.slice(1)}
					</h3>
				))}
			</div>
			<div
				className={styles.cardContainerWrapper}
				ref={cardContainerWrapperRef}
			>
				<div className={styles.cardContainer} ref={cardContainerRef}>
					<div className={styles.buffer}>&nbsp;</div>
					{cards &&
						cards.map(({ node: card }) => {
							const show =
								selectedCategory === categories[0] ||
								card?.frontmatter?.category ===
									selectedCategory;
							return (
								<Card
									key={card.id}
									show={show}
									featuredImage={
										card?.frontmatter?.featuredImage
											?.childImageSharp?.fluid
									}
									title={card?.frontmatter?.title}
									isFullArticle={card?.rawMarkdownBody !== ''}
									slug={card?.fields?.slug}
									text={card?.frontmatter?.card}
									displayDate={card?.frontmatter?.displayDate}
								/>
							);
						})}
					<div className={styles.buffer}>&nbsp;</div>
				</div>
			</div>
			<Timeline
				{...{
					ticks,
					viewportWidth,
					containerWidth,
					startPos,
					cardContainerWrapperRef,
				}}
			/>
		</section>
	);
};

export default Chronology;
