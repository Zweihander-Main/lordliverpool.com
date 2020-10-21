import { Link } from 'gatsby';
import React from 'react';
import styles from './contendersItem.module.scss';

type ContendersMenuProps = {
	id: string;
	isSelected: boolean;
	title?: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	slug: string;
};

const ContendersItem: React.FC<ContendersMenuProps> = ({
	id,
	isSelected,
	title,
	setSelected,
	slug,
}) => {
	return (
		<li className={styles.item}>
			<Link
				onMouseEnter={() => setSelected(id)}
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
};

const memoizedContendersItem = React.memo(
	ContendersItem,
	(prevProps, nextProps) => {
		if (prevProps.isSelected !== nextProps.isSelected) {
			return false;
		}
		return true;
	}
);

export default memoizedContendersItem;
