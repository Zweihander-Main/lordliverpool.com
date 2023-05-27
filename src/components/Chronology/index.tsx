import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import * as styles from './Chronology.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import FilterMenu from '../ChronoFilterMenu';
import Timeline from '../ChronoTimeline';
import Card from '../ChronoCard';
import ScrollLocContext from '../../contexts/ScrollLocContext';
import HistoryContext from '../../contexts/HistoryContext';

const TRACK = 'chronology';

const Chronology: React.FC = () => {
	const chronologyData = useStaticQuery<Queries.ChronologyQueryQuery>(graphql`
		query ChronologyQuery {
			noPost: allMarkdownRemark(
				sort: { frontmatter: { date: ASC } }
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
				sort: { frontmatter: { date: ASC } }
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

	// Don't animate cards until all data loaded
	const [animateCards, setAnimateCards] = React.useState(false);

	const cardContainerRef = React.useRef<HTMLDivElement>(null);
	const scrollingContainerRef = useRef<HTMLDivElement>(null);

	const { state, dispatch, getPositions, loadStorage } =
		useContext(ScrollLocContext);

	const selectedCategory = state[TRACK]?.contextState || 'all';

	const setSelectedCategory = useCallback(
		(state: string) => {
			dispatch({
				type: 'updateContextState',
				payload: state,
				track: TRACK,
			});
		},
		[dispatch]
	);
	const getPositionsRef = useRef(getPositions);

	const { isLastNavFromHistBack } = useContext(HistoryContext);

	const [cardIdToScrollTo, setCardIdToScrollTo] = useState<string | null>();
	const [scrollScrollingContainerTo, setScrollScrollingContainerTo] =
		useState<number>();

	useEffect(() => {
		const { id, pos } = getPositionsRef.current(TRACK);
		const fromBackButton = isLastNavFromHistBack();

		if (fromBackButton && pos) {
			// if from back button, try and restore exactly
			setScrollScrollingContainerTo(pos);
		} else if (id) {
			// else if id present, prioritize that
			setSelectedCategory('all');
			setCardIdToScrollTo(id);
		} else if (pos) {
			// else if only pos present, use that
			setScrollScrollingContainerTo(pos);
		} else {
			// page possibly reloaded, try asking storage
			const { pos: sPos } = loadStorage(TRACK);
			if (sPos) {
				// if pos available, try and restore exactly
				setScrollScrollingContainerTo(sPos);
			} else {
				// if not, no data available, cards can animate
				setAnimateCards(true);
			}
		}
	}, [isLastNavFromHistBack, setSelectedCategory, loadStorage]);

	useEffect(() => {
		if (scrollScrollingContainerTo && scrollingContainerRef.current) {
			scrollingContainerRef.current.scrollTop =
				scrollScrollingContainerTo;
		}
		setAnimateCards(true);
	}, [scrollScrollingContainerTo]);

	const cardContainerWrapperOnScroll: React.UIEventHandler<HTMLElement> =
		useCallback(
			(e) => {
				const { scrollTop } = e.target as HTMLElement;
				if (scrollTop) {
					dispatch({
						type: 'updatePos',
						payload: scrollTop,
						track: TRACK,
					});
				}
			},
			[dispatch]
		);

	// attached to card as ref
	const scrollThisCardWhenSetAsRef = useCallback(
		(targetCard: HTMLElement) => {
			if (scrollingContainerRef.current && targetCard) {
				const { innerWidth: viewportWidth } = window;
				const {
					offsetLeft: targetOffsetLeft,
					offsetWidth: targetWidth,
				} = targetCard;
				const newScrollTop =
					targetOffsetLeft - viewportWidth / 2 + targetWidth / 2;
				setScrollScrollingContainerTo(newScrollTop);
			}
		},
		[scrollingContainerRef]
	);

	// TODO bug where the year of the grabber is off when going back

	const [animateCardsAfterTimeout, setAnimateCardsAfterTimeout] =
		useState(false);
	useEffect(() => {
		const animateTimeout = window.setTimeout(() => {
			if (!animateCardsAfterTimeout) {
				setAnimateCardsAfterTimeout(true);
			}
		}, 300);
		return () => {
			window.clearTimeout(animateTimeout);
		};
	}, [animateCards, animateCardsAfterTimeout]);

	// Set scrolling container to be focused on the getgo
	useEffect(() => {
		if (cardContainerRef.current) {
			cardContainerRef.current.focus();
		}
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
				ref={scrollingContainerRef}
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
									animate={animateCardsAfterTimeout}
								/>
							);
						})}
					<div className={styles.buffer}>&nbsp;</div>
				</div>
			</div>
			<Timeline
				{...{
					ticks,
					cardContainerWrapperRef: scrollingContainerRef,
					cardContainerRef,
				}}
			/>
		</section>
	);
};

export default Chronology;
