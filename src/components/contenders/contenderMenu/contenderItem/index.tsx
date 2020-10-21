import { Link } from 'gatsby';
import React from 'react';
import styles from './contendersItem.module.scss';
import { AppLocState } from 'types';

type ContendersMenuProps = {
	id: string;
	isSelected: boolean;
	selected: string;
	title?: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	slug: string;
	menuRef: React.RefObject<HTMLElement>;
	refToSet: ((item: HTMLElement | null) => void) | null;
};

const ContendersItem: React.FC<ContendersMenuProps> = ({
	id,
	isSelected,
	selected,
	title,
	setSelected,
	slug,
	refToSet,
	menuRef,
}) => {
	const passingState: AppLocState = {
		get upperState() {
			return selected;
		},
		get initialPos() {
			return menuRef?.current?.scrollTop;
		},
	};

	return (
		<li className={styles.item} ref={refToSet}>
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
};

const memoizedContendersItem = React.memo(
	ContendersItem,
	(prevProps, nextProps) => {
		if (
			prevProps.isSelected !== nextProps.isSelected ||
			prevProps.refToSet !== nextProps.refToSet
		) {
			return false;
		}
		return true;
	}
);

export default memoizedContendersItem;
