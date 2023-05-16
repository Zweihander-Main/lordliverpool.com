import { Link } from 'gatsby';
import React, { useCallback, useState } from 'react';
import * as styles from './contendersItem.module.scss';

type ContendersMenuProps = {
	id: string;
	isSelected: boolean;
	title?: string | null;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	slug: string;
};

const ContendersItem = React.forwardRef<
	HTMLLIElement | null,
	ContendersMenuProps
>(({ id, isSelected, title, setSelected, slug }, ref) => {
	const handleTouchStart = useCallback(
		(e: React.TouchEvent<HTMLAnchorElement>, id: string) => {
			e.preventDefault();
			setSelected(id);
		},
		[setSelected]
	);

	const [preventClick, setPreventClick] = useState(false);

	const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
		(e) => {
			if (preventClick) {
				e.preventDefault();
			}
		},
		[preventClick]
	);

	const handlePointerDown: React.PointerEventHandler<HTMLAnchorElement> =
		useCallback(
			(e) => {
				if (e.nativeEvent.pointerType !== 'mouse' && !isSelected) {
					setPreventClick(true);
				} else {
					setPreventClick(false);
				}
			},
			[isSelected]
		);

	return (
		<li className={styles.item} ref={ref}>
			<Link
				onMouseEnter={() => setSelected(id)}
				onTouchStart={(e) => handleTouchStart(e, id)}
				onPointerDown={handlePointerDown}
				onClick={handleClick}
				to={slug}
				className={
					isSelected
						? `${styles.link} ${styles.selected}`
						: styles.link
				}
			>
				{title}
			</Link>
		</li>
	);
});

ContendersItem.displayName = 'ContendersItem';

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
