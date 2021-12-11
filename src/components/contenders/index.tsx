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

const Contenders: React.FC = () => {
	const blogRollData =
		useStaticQuery<GatsbyTypes.ContendersQueryQuery>(graphql`
			query ContendersQuery {
				allMarkdownRemark(
					sort: { order: ASC, fields: [frontmatter___date] }
					filter: {
						fields: { sourceInstanceName: { eq: "contenders" } }
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
								displayDate
								featuredImage {
									childImageSharp {
										gatsbyImageData(
											width: 800
											transformOptions: {
												grayscale: true
											}
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

	const menuRef = useRef<HTMLDivElement>(null);

	const {
		setPos,
		setId,
		getScrollLoc: getScrollLocCallback,
	} = useContext(ScrollLocContext);
	const getScrollLocRef = useRef(getScrollLocCallback);

	const { getLastNavigationFromBackButton } = useContext(HistoryContext);

	const [contenderIdToScrollTo, setContenderIdToScrollTo] = useState<
		string | null
	>();

	useLayoutEffect(() => {
		const { id, pos } = getScrollLocRef.current();
		const fromBackButton = getLastNavigationFromBackButton();

		if (fromBackButton && pos && menuRef.current) {
			menuRef.current.scrollTop = pos;
		}
		if (id) {
			setSelectedContenderId(id);
			setContenderIdToScrollTo(id);
		}
	}, [getLastNavigationFromBackButton]);

	const menuOnScroll: React.UIEventHandler<HTMLElement> = useCallback(
		(e) => {
			const { scrollTop } = e.target as HTMLElement;
			if (scrollTop) {
				setPos(scrollTop);
			}
		},
		[setPos]
	);

	const scrollToThisContenderWhenSetAsRef = useCallback(
		(targetContender: HTMLLIElement) => {
			if (menuRef.current && targetContender) {
				const { innerHeight: viewportHeight } = window;
				const { offsetHeight: targetHeight } = targetContender;
				const newScrollTop =
					targetContender.offsetTop -
					viewportHeight / 2 +
					targetHeight / 2;
				menuRef.current.scrollTop = newScrollTop;
			}
		},
		[menuRef]
	);

	useEffect(() => {
		setId(selectedContenderId);
	}, [selectedContenderId, setId]);

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
			<div className={styles.menu} ref={menuRef} onScroll={menuOnScroll}>
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
