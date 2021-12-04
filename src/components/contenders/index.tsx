import React from 'react';
import * as styles from './contenders.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import ContendersImage from './contendersImage';
import ContendersItem from './contenderItem';
import useScrollAndStateRestore from 'hooks/useScrollAndStateRestore';
import useLocationState from 'hooks/useLocationState';

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

	const menuRef = React.useRef<HTMLDivElement>(null);

	const calculateScrollDistance = (targetContender: HTMLElement) => {
		const { innerHeight: viewportHeight } = window;
		const toScroll = targetContender.offsetTop - viewportHeight / 2;
		return toScroll;
	};

	const {
		initialState,
		itemToScrollToOnLoad: contenderToScrollToOnLoad,
		scrolledToID: scrolledToContender,
	} = useLocationState({
		scrollContainer: menuRef,
		calculateScrollDistance,
	});

	const {
		onScroll: onMenuScroll,
		setState: setSelected,
		state: selected,
	} = useScrollAndStateRestore({
		identifier: 'contenders-menu',
		initialState: initialState.current || contenders[0].node.id || '',
		scrollContainer: menuRef,
	});

	React.useEffect(() => {
		if (scrolledToContender) {
			setSelected(scrolledToContender);
		}
	}, [scrolledToContender]);

	const selectedContender = contenders.find(
		(c) => c.node.id === selected
	)?.node;

	return (
		<section className={styles.contenders}>
			<ContendersImage
				featuredImage={
					selectedContender?.frontmatter?.featuredImage
						?.childImageSharp?.gatsbyImageData
				}
				displayDate={selectedContender?.frontmatter?.displayDate}
				title={selectedContender?.frontmatter?.title}
				selectedID={selectedContender?.id}
			/>
			<div className={styles.menu} ref={menuRef} onScroll={onMenuScroll}>
				<h1>Contenders for Greatest</h1>
				<ul className={styles.menuList}>
					{contenders &&
						contenders.map(({ node: contender }) => {
							return contender?.fields?.slug ? (
								<ContendersItem
									id={contender.id}
									isSelected={contender.id === selected}
									setSelected={setSelected}
									slug={contender?.fields?.slug}
									title={contender?.frontmatter?.title}
									key={contender.id}
									ref={
										contender.id === scrolledToContender
											? contenderToScrollToOnLoad
											: null
									}
									menuRef={menuRef}
									selected={selected}
								/>
							) : null;
						})}
				</ul>
			</div>
		</section>
	);
};

export default Contenders;
