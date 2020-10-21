import { Link, useScrollRestoration } from 'gatsby';
import React from 'react';
import styles from './contendersMenu.module.scss';

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
							<li key={contender.id}>
								<Link
									onMouseEnter={() =>
										setSelected(contender.id)
									}
									to={contender.fields.slug}
									className={
										contender.id === selected
											? `${styles.link} ${styles.selected}`
											: styles.link
									}
								>
									{contender?.frontmatter?.title}
								</Link>
							</li>
						) : null;
					})}
			</ul>
		</div>
	);
};

const memoizedContendersMenu = React.memo(
	ContendersMenu,
	(prevProps, nextProps) => {
		if (prevProps.selected !== nextProps.selected) {
			return false;
		}
		return true;
	}
);

export default memoizedContendersMenu;
