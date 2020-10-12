import React from 'react';

type ModalContextState = {
	open: boolean;
	toggleModal: () => void;
};

const ModalContext = React.createContext<ModalContextState>({
	open: false,
	toggleModal: () => {},
});

export default ModalContext;

type ModalProviderProps = {
	children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
	const [modalOpen, setModalOpen] = React.useState(false);

	const toggleModal = (): void => {
		setModalOpen((modalOpen) => (modalOpen ? false : true));
	};

	return (
		<ModalContext.Provider
			value={{
				open: modalOpen,
				toggleModal,
			}}
		>
			{children}
		</ModalContext.Provider>
	);
};

export const { Consumer: ModalConsumer } = ModalContext;
