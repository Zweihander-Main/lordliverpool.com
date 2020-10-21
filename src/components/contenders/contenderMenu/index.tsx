import { useScrollRestoration } from 'gatsby';
import React from 'react';
import styles from './contendersMenu.module.scss';
import ContendersItem from './contenderItem';

type ContendersMenuProps = {
	contenders: GatsbyTypes.ContendersQueryQuery['allMarkdownRemark']['edges'];
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	selected: string;
};

const ContendersMenu: React.FC<ContendersMenuProps> = ({
	contenders,
	setSelected,
	selected,
}) => {
	const { ref: menuRef, onScroll: onMenuScroll } = useScrollRestoration(
		`contenders-menu`
	);

	//TODO THIS
	// TODO also -- caching may not be perfect, may have to write own caching system using memorized components

	return (
		<div
			className={styles.menu}
			ref={menuRef as React.MutableRefObject<HTMLDivElement>}
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
							/>
						) : null;
					})}
			</ul>
		</div>
	);
};

const memoizedContendersMenu = React.memo(ContendersMenu, () => {
	return true;
});

export default memoizedContendersMenu;
