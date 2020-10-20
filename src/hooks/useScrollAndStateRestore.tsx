import ScrollPlusStateContext from 'contexts/ScrollPlusStateContext';
import {
	useRef,
	useContext,
	useLayoutEffect,
	useEffect,
	useState,
} from 'react';
import { useLocation } from '@reach/router';
import rafSchd from 'raf-schd';

// Adapter from Gatsby's version with additional state handling
// Usage note: do not spread on to JSX Element

interface useScrollAndStateRestoreProps {
	initialState: string;
	identifier: string;
}

interface ScrollRestorationProps {
	ref: React.RefObject<HTMLDivElement>;
	onScroll(): void;
	state: string;
	setState: React.Dispatch<React.SetStateAction<string>>;
}

const useScrollAndStateRestore = ({
	identifier,
	initialState,
}: useScrollAndStateRestoreProps): ScrollRestorationProps => {
	const location = useLocation();
	const storage = useContext(ScrollPlusStateContext);
	const ref = useRef<HTMLDivElement>(null);
	const [state, setState] = useState(initialState);

	const scrollToRefPos = (pos: number) => {
		if (ref.current) {
			ref.current.scrollTop = pos || 0;
		}
	};

	const rafScrollToRefPos = rafSchd(scrollToRefPos);

	useLayoutEffect(() => {
		if (ref.current) {
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
		if (ref.current) {
			storage.save(location, identifier, ref.current.scrollTop, state);
		}
	};

	useEffect(() => {
		save();
	}, [state]);

	return {
		ref,
		onScroll: save,
		state,
		setState,
	};
};

export default useScrollAndStateRestore;
