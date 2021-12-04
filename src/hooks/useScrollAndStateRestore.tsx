import ScrollPlusStateContext from 'contexts/ScrollPlusStateContext';
import { useContext, useLayoutEffect, useEffect, useState } from 'react';
import { useLocation } from '@reach/router';
import rafSchd from 'raf-schd';

// Adapter from Gatsby's version with additional state handling
// Usage note: do not spread on to JSX Element

interface useScrollAndStateRestoreProps {
	initialState?: string;
	identifier: string;
	scrollContainer: React.RefObject<HTMLElement>;
}

interface ScrollRestorationProps {
	onScroll(): void;
	state: string;
	setState: React.Dispatch<React.SetStateAction<string>>;
}

const useScrollAndStateRestore = ({
	identifier,
	initialState,
	scrollContainer,
}: useScrollAndStateRestoreProps): ScrollRestorationProps => {
	const location = useLocation();
	const storage = useContext(ScrollPlusStateContext);
	const [state, setState] = useState<string>(initialState || '');

	const scrollToRefPos = (pos: number) => {
		if (scrollContainer.current) {
			scrollContainer.current.scrollTop = pos || 0;
		}
	};

	const rafScrollToRefPos = rafSchd(scrollToRefPos);

	useLayoutEffect(() => {
		if (scrollContainer.current) {
			const readState = storage.read(location, identifier);
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
	}, []);

	const save = () => {
		if (scrollContainer.current) {
			storage.save(
				location,
				identifier,
				scrollContainer.current.scrollTop,
				state
			);
		}
	};

	useEffect(() => {
		save();
	}, [state]);

	return {
		onScroll: save,
		state,
		setState,
	};
};

export default useScrollAndStateRestore;
