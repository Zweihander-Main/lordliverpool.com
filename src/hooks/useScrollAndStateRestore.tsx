import {
	useContext,
	useLayoutEffect,
	useEffect,
	useState,
	useCallback,
} from 'react';
import StorageContext from 'contexts/StorageContext';
import rafSchd from 'raf-schd';

// Adapter from Gatsby's version with additional state handling
// Usage note: do not spread on to JSX Element

interface useScrollAndStateRestoreProps {
	initialState?: string;
	scrollContainer: React.RefObject<HTMLElement>;
}

interface ScrollRestorationProps {
	onScroll(): void;
	state: string;
	setState: React.Dispatch<React.SetStateAction<string>>;
}

const useScrollAndStateRestore = ({
	initialState,
	scrollContainer,
}: useScrollAndStateRestoreProps): ScrollRestorationProps => {
	const storage = useContext(StorageContext);
	const [state, setState] = useState<string>(initialState || '');

	const scrollToRefPos = useCallback(
		(pos: number) => {
			if (scrollContainer.current) {
				scrollContainer.current.scrollTop = pos || 0;
			}
		},
		[scrollContainer]
	);

	useLayoutEffect(() => {
		const rafScrollToRefPos = rafSchd(scrollToRefPos);
		if (scrollContainer.current) {
			const readState = storage.loadSavedState();
			if (readState) {
				const { position: savedPos, state: savedState } = readState;
				if (savedState) {
					setState(savedState);
				}
				if (savedPos) {
					rafScrollToRefPos(savedPos);
				}
			}
		}
		return () => {
			rafScrollToRefPos.cancel();
		};
	}, [storage, scrollContainer, scrollToRefPos]);

	const save = useCallback(() => {
		if (scrollContainer.current) {
			storage.saveState(scrollContainer.current.scrollTop, state);
		}
	}, [scrollContainer, state, storage]);

	useEffect(() => {
		save();
	}, [state, save]);

	return {
		onScroll: save,
		state,
		setState,
	};
};

export default useScrollAndStateRestore;
