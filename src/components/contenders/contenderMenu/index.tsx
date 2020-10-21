import React from 'react';
import styles from './contendersMenu.module.scss';
import ContendersItem from './contenderItem';

type ContendersMenuProps = {
	contenders: GatsbyTypes.ContendersQueryQuery['allMarkdownRemark']['edges'];
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	selected: string;
	menuRef: React.RefObject<HTMLElement>;
	onMenuScroll: () => void;
	refToSet: ((item: HTMLElement | null) => void) | null;
	scrolledToContender: string | undefined;
};

const ContendersMenu: React.FC<ContendersMenuProps> = ({
	contenders,
	setSelected,
	selected,
	menuRef,
	onMenuScroll,
	refToSet,
	scrolledToContender,
}) => {
	return (
		<div
			className={styles.menu}
			ref={menuRef as React.RefObject<HTMLDivElement>}
			onScroll={onMenuScroll}
		>
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
								refToSet={
									contender.id === scrolledToContender
										? refToSet
										: null
								}
								menuRef={menuRef}
								selected={selected}
							/>
						) : null;
					})}
			</ul>
		</div>
	);
};

export default ContendersMenu;
