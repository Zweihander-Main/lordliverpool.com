import React from 'react';
import * as styles from './retailersButton.module.scss';
import { MdShoppingCart } from 'react-icons/md';

const RetailersButton: React.FC = () => {
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
			aria-label={'Bring up available retailers'}
		>
			<MdShoppingCart className={styles.icon} />
			<span className={styles.text}>Order now!</span>
		</a>
	);
};

export default RetailersButton;
