import React from 'react';
import styles from './retailersButton.module.scss';
import { MdShoppingCart } from 'react-icons/md';

const RetailersButton: React.FC = ({}) => {
	return (
		<a className={styles.button} href={'#retailers'}>
			<MdShoppingCart className={styles.icon} />
			<h6 className={styles.text}>Pre-order now!</h6>
		</a>
	);
};

export default RetailersButton;
