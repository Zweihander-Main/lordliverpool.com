import React from 'react';
import useJS from 'hooks/useJS';
import styles from './retailersButton.module.scss';
import ModalContext from 'contexts/ModalContext';
import { MdShoppingCart } from 'react-icons/md';

const RetailersButton: React.FC = ({}) => {
	const hasJS = useJS();
	const { toggleModal } = React.useContext(ModalContext);

	const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		toggleModal();
	};

	return (
		<a
			className={styles.button}
			href={hasJS ? '' : '#retailers'}
			onClick={onClick}
		>
			<MdShoppingCart className={styles.icon} />
			<h6 className={styles.text}>Pre-order now!</h6>
		</a>
	);
};

export default RetailersButton;
