import React, {
	useCallback,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import * as styles from './chronology.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import FilterMenu from './filterMenu';
import Timeline from './timeline';
import Card from './card';
import ScrollLocContext from 'contexts/ScrollLocContext';
import HistoryContext from 'contexts/HistoryContext';

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
	const cardContainerWrapperRef = useRef<HTMLDivElement>(null);

	const {
		contextState: selectedCategory,
		setContextState: setSelectedCategory,
		getScrollLoc: getScrollLocCallback,
		setPos,
	} = useContext(ScrollLocContext);
	const getScrollLocRef = useRef(getScrollLocCallback);

	const { getLastNavigationFromBackButton } = useContext(HistoryContext);

	const [cardIdToScrollTo, setCardIdToScrollTo] = useState<string | null>();

	useLayoutEffect(() => {
		const { id, pos } = getScrollLocRef.current();
		const fromBackButton = getLastNavigationFromBackButton();

		if (fromBackButton && pos && cardContainerWrapperRef.current) {
			cardContainerWrapperRef.current.scrollTop = pos;
		} else if (id) {
			setSelectedCategory('all');
			setCardIdToScrollTo(id);
		} else if (pos && cardContainerWrapperRef.current) {
			cardContainerWrapperRef.current.scrollTop = pos;
		}
	}, [getLastNavigationFromBackButton, setSelectedCategory]);

	const cardContainerWrapperOnScroll: React.UIEventHandler<HTMLElement> =
		useCallback(
			(e) => {
				const { scrollTop } = e.target as HTMLElement;
				if (scrollTop) {
					setPos(scrollTop);
				}
			},
			[setPos]
		);

	// attached to card as ref
	const scrollThisCardWhenSetAsRef = useCallback(
		(targetCard: HTMLElement) => {
			if (cardContainerWrapperRef.current && targetCard) {
				const { innerWidth: viewportWidth } = window;
				const {
					offsetLeft: targetOffsetLeft,
					offsetWidth: targetWidth,
				} = targetCard;
				const newScrollTop =
					targetOffsetLeft - viewportWidth / 2 + targetWidth / 2;
				cardContainerWrapperRef.current.scrollTop = newScrollTop;
			}
		},
		[cardContainerWrapperRef]
	);

	// TODO bug where the year of the grabber is off when going back
	// TODO: checking session storage being checked can be done programmtically

	// Don't animate cards until a bit of time has passed to allow session
	// storage to be checked
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
