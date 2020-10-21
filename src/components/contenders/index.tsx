import React from 'react';
import styles from './contenders.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import ContendersImage from './contendersImage';
import ContendersMenu from './contenderMenu';
import useScrollAndStateRestore from 'hooks/useScrollAndStateRestore';
import useLocationState from 'hooks/useLocationState';

const Contenders: React.FC = () => {
	const blogRollData = useStaticQuery<
		GatsbyTypes.ContendersQueryQuery
	>(graphql`
		query ContendersQuery {
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___date] }
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
									fluid(maxWidth: 800, grayscale: true) {
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

	const { edges: contenders } = blogRollData.allMarkdownRemark;

	const menuRef = React.useRef<HTMLElement>(null);

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
		identifier: `contenders-menu`,
		initialState: initialState.current || contenders[0].node.id || '',
		scrollContainer: menuRef,
	});

	React.useEffect(() => {
		if (scrolledToContender) {
			setSelected(scrolledToContender);
		}
	}, [scrolledToContender]);

	const selectedContender = contenders.find((c) => c.node.id === selected)
		?.node;

	return (
		<section className={styles.contenders}>
			<ContendersImage
				featuredImage={
					selectedContender?.frontmatter?.featuredImage
						?.childImageSharp?.fluid
				}
				displayDate={selectedContender?.frontmatter?.displayDate}
				title={selectedContender?.frontmatter?.title}
				selectedID={selectedContender?.id}
			/>
			<ContendersMenu
				selected={selected}
				setSelected={setSelected}
				contenders={contenders}
				menuRef={menuRef}
				onMenuScroll={onMenuScroll}
				refToSet={contenderToScrollToOnLoad}
				scrolledToContender={scrolledToContender}
			/>
		</section>
	);
};

export default Contenders;
