import ScrollPlusStateContext from 'contexts/ScrollPlusStateContext';
import {
	useRef,
	useContext,
	useLayoutEffect,
	useEffect,
	useState,
} from 'react';
import { useLocation } from '@reach/router';

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
	const [savedPosition, setSavedPos] = useState(0);

	useLayoutEffect(() => {
		if (ref.current) {
			const readState = storage.read(location, identifier);
			if (readState) {
				const { position: savedPos, state: savedState } = readState;
				if (savedState) {
					setState(savedState);
				}
				if (savedPos) {
					// Wait a tick to allow re-render with new state
					setTimeout(() => {
						if (ref.current) {
							console.log(`scroll`);
							ref.current.scrollTop = savedPos || 0;
						}
					}, 0);
				}
			}
		}
	}, []);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = savedPosition || 0;
		}
	}, [savedPosition]);

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
