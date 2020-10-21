import React from 'react';
import styles from './chronology.module.scss';
import { cardWidth } from 'styles/util/_variables.global.scss';
import { useStaticQuery, graphql } from 'gatsby';
import Timeline from './timeline';
import Card from './card';
import useScrollAndStateRestore from 'hooks/useScrollAndStateRestore';
import useLocationState from 'hooks/useLocationState';

const Chronology: React.FC = () => {
	const chronologyData = useStaticQuery<
		GatsbyTypes.ChronologyQueryQuery
	>(graphql`
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
									fluid(maxWidth: 500) {
										...GatsbyImageSharpFluid
									}
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
									fluid(maxWidth: 500) {
										...GatsbyImageSharpFluid
									}
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
	const cardContainerWrapperRef = React.useRef<HTMLElement>(null);

	const calculateScrollDistance = (targetCard: HTMLElement) => {
		const {
			innerWidth: viewportWidth,
			innerHeight: viewportHeight,
		} = window;
		const cardAdjustment = viewportHeight * cardWidth;
		const toScroll =
			targetCard.offsetLeft - viewportWidth / 2 + cardAdjustment / 2;
		return toScroll;
	};

	const {
		initialState,
		itemToScrollToOnLoad: cardToScrollToOnLoad,
		scrolledToID: scrolledToCardID,
	} = useLocationState({
		scrollContainer: cardContainerWrapperRef,
		calculateScrollDistance,
	});

	const {
		state: selectedCategory,
		setState: setSelectedCategory,
		onScroll: cardContainerWrapperOnScroll,
	} = useScrollAndStateRestore({
		identifier: `card-container-wrapper`,
		initialState: initialState.current || 'all',
		scrollContainer: cardContainerWrapperRef,
	});

	// Don't animate cards until a bit of time has passed to allow session
	// storage to be checked
	const [animateCards, setAnimateCards] = React.useState(false);

	React.useEffect(() => {
		const animateTimeout = setTimeout(() => {
			setAnimateCards(true);
		}, 500);
		return () => {
			clearTimeout(animateTimeout);
		};
	}, []);

	const ticks = (selectedCategory !== categories.current[0]
		? cards.current.filter(
				(value) => value?.frontmatter?.category === selectedCategory
		  )
		: cards.current
	)
		.map((card) => card.frontmatter?.date)
		.filter((year) => typeof year !== 'undefined') as Array<string>; //not cheating, TS won't filter out undefined types

	return (
		<section className={styles.chronology}>
			<h1 className={styles.chronologyTitle}>Chronology</h1>
			<div className={styles.filterMenu}>
				{categories.current.map((category) => (
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
				ref={cardContainerWrapperRef as React.RefObject<HTMLDivElement>}
				onScroll={cardContainerWrapperOnScroll}
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
									refToSet={
										card.id === scrolledToCardID
											? cardToScrollToOnLoad
											: null
									}
									key={card.id}
									show={show}
									featuredImage={
										card?.frontmatter?.featuredImage
											?.childImageSharp?.fluid
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
