import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { useLocation } from '@reach/router';
import { LocTyping } from 'types';
import StorageContext from './StorageContext';

type ScrollStateContextProps = {
	scrollContextState: string;
	setScrollContextState: React.Dispatch<React.SetStateAction<string>>;
	posToScrollTo: number | null;
	idToScrollTo: string | null;
	scrollContainerRef: React.RefObject<HTMLDivElement>;
	onScroll(this: void): void;
	saveId(this: void, id: string): void;
};

const ScrollStateContext = createContext<ScrollStateContextProps>({
	scrollContextState: 'all',
	setScrollContextState: () => null,
	posToScrollTo: null,
	idToScrollTo: null,
	scrollContainerRef: { current: null },
	onScroll: () => null,
	saveId: () => null,
});

export default ScrollStateContext;

/**
 * AppLocState is passed between card/contender links and singlePost object
 */

export const ScrollStateProvider: React.FC = ({ children }) => {
	const location = useLocation() as LocTyping;
	const storage = useContext(StorageContext);

	const [scrollContextState, setScrollContextState] = useState<string>(
		location?.state?.upperState || 'all'
	);
	const [posToScrollTo, setPosToScrollTo] = useState<number | null>(
		location?.state?.initialPos || null
	);
	const [idToScrollTo, setIdToScrollTo] = useState<string | null>(
		location?.state?.id || null
	);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// location
	useLayoutEffect(() => {
		const locScrollToID = location?.state?.id;
		const locInitialPos = location?.state?.initialPos;
		console.log('======== loc: ', { locScrollToID, locInitialPos });
		if (typeof locInitialPos === 'number') {
			setPosToScrollTo(locInitialPos);
		} else if (locScrollToID) {
			setScrollContextState('all');
			setPosToScrollTo(null);
			setIdToScrollTo(locScrollToID);
		}
	}, [location]);

	// TODO: click on one, then go back, then click on another, then press back button

	// storage
	useLayoutEffect(() => {
		if (scrollContainerRef.current) {
			const readState = storage.loadSavedState();
			const readId = storage.loadSavedId();
			if (readId) {
				const { id } = readId;
				if (id) {
					setIdToScrollTo(id);
				}
			} else if (readState) {
				const { position: savedPos, state: savedState } = readState;
				if (savedState) {
					setScrollContextState(savedState);
				}
				if (savedPos) {
					setIdToScrollTo(null);
					setPosToScrollTo(savedPos);
				}
			}
		}
	}, [storage, scrollContainerRef]);

	const saveContextState = useCallback(() => {
		if (scrollContainerRef.current) {
			storage.saveState(
				scrollContainerRef.current.scrollTop,
				scrollContextState
			);
		}
	}, [scrollContainerRef, scrollContextState, storage]);

	useEffect(() => {
		saveContextState();
	}, [scrollContextState, saveContextState]);

	const saveId = useCallback(
		(id: string) => {
			storage.saveId(id);
		},
		[storage]
	);

	return (
		<ScrollStateContext.Provider
			value={{
				scrollContextState,
				setScrollContextState,
				posToScrollTo,
				idToScrollTo,
				onScroll: saveContextState,
				saveId,
				scrollContainerRef,
			}}
		>
			{children}
		</ScrollStateContext.Provider>
	);
};

export const { Consumer: ScrollStateConsumer } = ScrollStateContext;
