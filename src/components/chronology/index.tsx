import React, {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
} from 'react';
import * as styles from './chronology.module.scss';
import { cardWidth } from 'styles/util/_variables.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import FilterMenu from './filterMenu';
import Timeline from './timeline';
import Card from './card';
import ScrollStateContext from 'contexts/ScrollStateContext';

const Chronology: React.FC = () => {
	const chronologyData =
		useStaticQuery<GatsbyTypes.ChronologyQueryQuery>(graphql`
			query ChronologyQuery {
				noPost: allMarkdownRemark(
					sort: { order: ASC, fields: [frontmatter___date] }
					filter: {
						fields: { sourceInstanceName: { eq: "chronology" } }
						rawMarkdownBody: { eq: "" }
					}
				) {
					edges {
						node {
							id
							frontmatter {
								title
								date(formatString: "y")
								displayDate
								category
								card
								featuredImage {
									childImageSharp {
										gatsbyImageData(
											width: 600
											layout: CONSTRAINED
										)
									}
								}
							}
						}
					}
				}
				withPost: allMarkdownRemark(
					sort: { order: ASC, fields: [frontmatter___date] }
					filter: {
						fields: { sourceInstanceName: { eq: "chronology" } }
						rawMarkdownBody: { ne: "" }
					}
				) {
					edges {
						node {
							id
							fields {
								slug
							}
							frontmatter {
								title
								date(formatString: "y")
								displayDate
								category
								card
								featuredImage {
									childImageSharp {
										gatsbyImageData(
											width: 600
											layout: CONSTRAINED
										)
									}
								}
							}
						}
					}
				}
			}
		`);

	const cards = React.useRef(
		(() => {
			const { edges: cardsWithoutPost } = chronologyData.noPost;
			const { edges: cardsWithPost } = chronologyData.withPost;
			return [
				...cardsWithPost.map((card) => {
					return { ...card.node, hasPost: true };
				}),
				...cardsWithoutPost.map((card) => {
					return {
						...card.node,
						fields: { slug: '' },
						hasPost: false,
					};
				}),
			];
		})()
	);

	const categories = React.useRef(
		(() => {
			const pulledInCategories = cards.current
				.map((c) => c?.frontmatter?.category || '')
				.filter((value, index, self) => self.indexOf(value) === index)
				.filter((value) => value && value !== '');

			return ['all', ...pulledInCategories];
		})()
	);

	const cardContainerRef = React.useRef<HTMLDivElement>(null);

	const {
		scrollContextState: selectedCategory,
		setScrollContextState: setSelectedCategory,
		idToScrollTo: cardIdToScrollTo,
		posToScrollTo: cardPosToScrollTo,
		onScroll: cardContainerWrapperOnScroll,
		scrollContainerRef: cardContainerWrapperRef,
	} = useContext(ScrollStateContext);

	// attached to card as ref
	const scrollThisCardWhenSetAsRef = useCallback(
		(targetCard: HTMLElement) => {
			if (cardContainerWrapperRef.current && targetCard) {
				const {
					innerWidth: viewportWidth,
					innerHeight: viewportHeight,
				} = window;
				const cardAdjustment = viewportHeight * parseInt(cardWidth, 10);
				const distanceToScroll =
					targetCard.offsetLeft -
					viewportWidth / 2 +
					cardAdjustment / 2;
				cardContainerWrapperRef.current.scrollTop = distanceToScroll;
			}
		},
		[cardContainerWrapperRef]
	);

	// pos scroll
	useLayoutEffect(() => {
		if (cardPosToScrollTo && cardContainerWrapperRef.current) {
			cardContainerWrapperRef.current.scrollTop = cardPosToScrollTo;
		}
	}, [cardPosToScrollTo, cardContainerWrapperRef]);

	// TODO bug where the year of the grabber is off when going back

	// Don't animate cards until a bit of time has passed to allow session
	// storage to be checked
	// TODO: checking session storage being checked can be done programmtically
	const [animateCards, setAnimateCards] = React.useState(false);

	React.useEffect(() => {
		const animateTimeout = window.setTimeout(() => {
			setAnimateCards(true);
		}, 500);

		// Set scrolling container to be focused on the getgo
		if (cardContainerRef.current) {
			cardContainerRef.current.focus();
		}
		return () => {
			window.clearTimeout(animateTimeout);
		};
	}, []);

	const ticks: Array<string> = (
		selectedCategory !== categories.current[0]
			? cards.current.filter(
					(value) => value?.frontmatter?.category === selectedCategory
			  )
			: cards.current
	)
		.map((card) => card.frontmatter?.date)
		.filter((year): year is string => typeof year !== 'undefined');

	return (
		<section className={styles.chronology}>
			<FilterMenu
				{...{
					categories,
					setSelectedCategory,
					selectedCategory,
				}}
			/>
			<div
				className={styles.cardContainerWrapper}
				ref={cardContainerWrapperRef}
				onScroll={cardContainerWrapperOnScroll}
				id={'chronology-scrolling-container'}
			>
				<div className={styles.cardContainer} ref={cardContainerRef}>
					<div className={styles.buffer}>&nbsp;</div>
					{cards.current &&
						cards.current.map((card) => {
							const show =
								selectedCategory === categories.current[0] ||
								card?.frontmatter?.category ===
									selectedCategory;
							return (
								<Card
									ref={
										card.id === cardIdToScrollTo
											? scrollThisCardWhenSetAsRef
											: null
									}
									key={card.id}
									show={show}
									featuredImage={
										card?.frontmatter?.featuredImage
											?.childImageSharp?.gatsbyImageData
									}
									title={card?.frontmatter?.title}
									isFullArticle={card.hasPost}
									slug={card?.fields?.slug}
									text={card?.frontmatter?.card}
									displayDate={card?.frontmatter?.displayDate}
									animate={animateCards}
									selectedCategory={selectedCategory}
									cardContainerWrapperRef={
										cardContainerWrapperRef
									}
								/>
							);
						})}
					<div className={styles.buffer}>&nbsp;</div>
				</div>
			</div>
			<Timeline
				{...{
					ticks,
					cardContainerWrapperRef,
					cardContainerRef,
				}}
			/>
		</section>
	);
};

export default Chronology;
