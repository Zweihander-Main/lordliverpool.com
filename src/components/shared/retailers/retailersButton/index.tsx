import React from 'react';
import styles from './retailersButton.module.scss';
import { MdShoppingCart } from 'react-icons/md';

const RetailersButton: React.FC = ({}) => {
	// Stop the page from jumping. e.preventDefault stops the modal from opening
	// at all
	const onButtonClick = () => {
		return false;
	};

	return (
		<a
			className={styles.button}
			href={'#retailers'}
			onClick={onButtonClick}
		>
			<MdShoppingCart className={styles.icon} />
			<h6 className={styles.text}>Pre-order now!</h6>
		</a>
	);
};

export default RetailersButton;
