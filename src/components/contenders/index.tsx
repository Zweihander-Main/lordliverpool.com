import React, {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react';
import * as styles from './contenders.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import ContendersImage from './contendersImage';
import ContendersItem from './contenderItem';
import ScrollStateContext from 'contexts/ScrollStateContext';

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

	const {
		idToScrollTo: contenderIdToScrollTo,
		scrollContainerRef: menuRef,
		posToScrollTo: contenderPosToScrollTo,
		onScroll,
		saveId,
	} = useContext(ScrollStateContext);

	const [selectedContenderId, setSelectedContenderId] = useState<string>(
		contenders[0].node.id || ''
	);

	const scrollToThisContenderWhenSetAsRef = useCallback(
		(targetContender: HTMLLIElement) => {
			console.log('scroll: ', { targetContender });
			if (menuRef.current && targetContender) {
				const { innerHeight: viewportHeight } = window;
				const distanceToScroll =
					targetContender.offsetTop - viewportHeight / 2;
				menuRef.current.scrollTop = distanceToScroll;
			}
		},
		[menuRef]
	);

	// id scroll
	useLayoutEffect(() => {
		if (contenderIdToScrollTo) {
			setSelectedContenderId(contenderIdToScrollTo);
		}
	}, [contenderIdToScrollTo, setSelectedContenderId]);

	// pos scroll
	useLayoutEffect(() => {
		if (contenderPosToScrollTo && menuRef.current) {
			menuRef.current.scrollTop = contenderPosToScrollTo;
		}
	}, [contenderPosToScrollTo, menuRef]);

	useEffect(() => {
		saveId(selectedContenderId);
	}, [selectedContenderId, saveId]);

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
			<div className={styles.menu} ref={menuRef} onScroll={onScroll}>
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
									menuRef={menuRef}
								/>
							) : null;
						})}
				</ul>
			</div>
		</section>
	);
};

export default Contenders;
