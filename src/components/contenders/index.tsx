import React, {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import * as styles from './contenders.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import ContendersImage from './contendersImage';
import ContendersItem from './contenderItem';
import ScrollLocContext from 'contexts/ScrollLocContext';
import HistoryContext from 'contexts/HistoryContext';

const TRACK = 'contenders';

const Contenders: React.FC = () => {
	const blogRollData = useStaticQuery<Queries.ContendersQueryQuery>(graphql`
		query ContendersQuery {
			allMarkdownRemark(
				sort: { frontmatter: { date: ASC } }
				filter: { fields: { sourceInstanceName: { eq: "contenders" } } }
			) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							title
							displayDate
							featuredImage {
								childImageSharp {
									gatsbyImageData(
										width: 800
										transformOptions: { grayscale: true }
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

	const { edges: contenders } = blogRollData.allMarkdownRemark;

	const [selectedContenderId, setSelectedContenderId] = useState<string>(
		contenders[0].node.id || ''
	);

	const scrollingMenuRef = useRef<HTMLDivElement>(null);

	const { dispatch, getPositions, loadStorage } =
		useContext(ScrollLocContext);
	const getPositionsRef = useRef(getPositions);

	const { isLastNavFromHistBack } = useContext(HistoryContext);

	const [contenderIdToScrollTo, setContenderIdToScrollTo] = useState<
		string | null
	>();
	const [scrollScrollingContainerTo, setScrollScrollingContainerTo] =
		useState<number>();

	useLayoutEffect(() => {
		const { id, pos } = getPositionsRef.current(TRACK);
		const fromBackButton = isLastNavFromHistBack();

		if (fromBackButton && pos) {
			// if from back button, try and restore exactly
			setScrollScrollingContainerTo(pos);
			if (id) {
				setSelectedContenderId(id);
			}
		} else if (id) {
			// else if id present, go to that
			setSelectedContenderId(id);
			setContenderIdToScrollTo(id);
		} else if (pos) {
			// else if pos present, restore just that
			setScrollScrollingContainerTo(pos);
		} else {
			// page possibly reloaded, try asking storage
			const { pos: sPos, id: sId } = loadStorage(TRACK);
			if (sPos) {
				// if pos available, try and restore exactly
				setScrollScrollingContainerTo(sPos);
				if (sId) {
					setSelectedContenderId(sId);
				}
			} else if (sId) {
				// otherwise, go to id if present
				setSelectedContenderId(sId);
				setContenderIdToScrollTo(sId);
			}
		}
	}, [isLastNavFromHistBack, loadStorage]);

	useLayoutEffect(() => {
		if (scrollScrollingContainerTo && scrollingMenuRef.current) {
			scrollingMenuRef.current.scrollTop = scrollScrollingContainerTo;
		}
	}, [scrollScrollingContainerTo]);

	const menuOnScroll: React.UIEventHandler<HTMLElement> = useCallback(
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

	const scrollToThisContenderWhenSetAsRef = useCallback(
		(targetContender: HTMLLIElement) => {
			if (scrollingMenuRef.current && targetContender) {
				const { innerHeight: viewportHeight } = window;
				const { offsetHeight: targetHeight } = targetContender;
				const newScrollTop =
					targetContender.offsetTop -
					viewportHeight / 2 +
					targetHeight / 2;
				setScrollScrollingContainerTo(newScrollTop);
			}
		},
		[scrollingMenuRef]
	);

	useEffect(() => {
		dispatch({
			type: 'updateId',
			payload: selectedContenderId,
			track: TRACK,
		});
	}, [dispatch, selectedContenderId]);

	const selectedContenderNode = contenders.find(
		(c) => c.node.id === selectedContenderId
	)?.node;

	return (
		<section className={styles.contenders}>
			<ContendersImage
				featuredImage={
					selectedContenderNode?.frontmatter?.featuredImage
						?.childImageSharp?.gatsbyImageData
				}
				displayDate={selectedContenderNode?.frontmatter?.displayDate}
				title={selectedContenderNode?.frontmatter?.title}
				selectedID={selectedContenderNode?.id}
			/>
			<div
				className={styles.menu}
				ref={scrollingMenuRef}
				onScroll={menuOnScroll}
			>
				<p className={styles.doubleTapMsg}>Double tap to open</p>
				<h1>Contenders for Greatest</h1>
				<ul className={styles.menuList}>
					{contenders &&
						contenders.map(({ node: contender }) => {
							return contender?.fields?.slug ? (
								<ContendersItem
									id={contender.id}
									isSelected={
										contender.id === selectedContenderId
									}
									setSelected={setSelectedContenderId}
									slug={contender?.fields?.slug}
									title={contender?.frontmatter?.title}
									key={contender.id}
									ref={
										contender.id === contenderIdToScrollTo
											? scrollToThisContenderWhenSetAsRef
											: null
									}
								/>
							) : null;
						})}
				</ul>
			</div>
		</section>
	);
};

export default Contenders;
