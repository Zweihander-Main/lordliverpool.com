import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import StorageContext from './StorageContext';

export type ScrollLoc = {
	id?: string;
	pos?: number;
};

type ScrollStateContextProps = {
	contextState: string;
	setContextState: React.Dispatch<React.SetStateAction<string>>;
	setPos(this: void, pos: number): void;
	setId(this: void, id: string): void;
	getScrollLoc(this: void): ScrollLoc;
	loadStorage(this: void): ScrollLoc;
};

const ScrollStateContext = createContext<ScrollStateContextProps>({
	contextState: 'all',
	setContextState: () => null,
	setPos: () => null,
	setId: () => null,
	getScrollLoc: () => ({}),
	loadStorage: () => ({}),
});

export default ScrollStateContext;

export const ScrollLocProvider: React.FC = ({ children }) => {
	const storage = useContext(StorageContext);

	const [contextState, setContextState] = useState<string>('all');

	const [pos, setPos] = useState<number | null>(null);
	const [id, setId] = useState<string | null>(null);

	const getScrollLoc = useCallback(() => {
		const returnObj: ScrollLoc = {};
		if (id) {
			returnObj.id = id;
		}
		if (pos) {
			returnObj.pos = pos;
		}
		setPos(null);
		setId(null);
		return returnObj;
	}, [id, pos]);

	const loadStorage = useCallback(() => {
		const returnObj: ScrollLoc = {};
		const savedState = storage.loadSavedState();
		if (savedState) {
			const { position, state } = savedState;
			setPos(position);
			returnObj.pos = position;
			setContextState(state);
		}
		const savedId = storage.loadSavedId();
		if (savedId) {
			const { id: sId } = savedId;
			setId(sId);
			returnObj.id = sId;
		}
		return returnObj;
	}, [storage]);

	useEffect(() => {
		if (pos) {
			storage.saveState(pos, contextState);
		}
	}, [storage, contextState, pos]);

	useEffect(() => {
		if (id) {
			storage.saveId(id);
		}
	}, [storage, id]);

	return (
		<ScrollStateContext.Provider
			value={{
				contextState,
				setContextState,
				setPos,
				setId,
				getScrollLoc,
				loadStorage,
			}}
		>
			{children}
		</ScrollStateContext.Provider>
	);
};

export const { Consumer: ScrollLocConsumer } = ScrollStateContext;
