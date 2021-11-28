import { Link } from 'gatsby';
import React from 'react';
import * as styles from './contendersItem.module.scss';
import { AppLocState } from 'types';

type ContendersMenuProps = {
	id: string;
	isSelected: boolean;
	selected: string;
	title?: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	slug: string;
	menuRef: React.RefObject<HTMLDivElement>;
};

const ContendersItem = React.forwardRef<
	HTMLLIElement | null,
	ContendersMenuProps
>(({ id, isSelected, selected, title, setSelected, slug, menuRef }, ref) => {
	const passingState: AppLocState = {
		get upperState() {
			return selected;
		},
		get initialPos() {
			return menuRef?.current?.scrollTop;
		},
	};

	return (
		<li className={styles.item} ref={ref}>
			<Link
				onMouseEnter={() => setSelected(id)}
				to={slug}
				className={
					isSelected
						? `${styles.link} ${styles.selected}`
						: styles.link
				}
				state={passingState}
			>
				{title}
			</Link>
		</li>
	);
});

const memoizedContendersItem = React.memo(
	ContendersItem,
	(prevProps, nextProps) => {
		if (
			prevProps.isSelected !== nextProps.isSelected ||
			prevProps.ref !== nextProps.ref
		) {
			return false;
		}
		return true;
	}
);

export default memoizedContendersItem;
