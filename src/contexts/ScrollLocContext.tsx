import React, {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import StorageContext from './StorageContext';
import { ScrollLocReducerState } from 'types';

export type ScrollLoc = {
	id?: string;
	pos?: number;
};

type ScrollStateContextProps = {
	state: ScrollLocReducerState;
	dispatch: React.Dispatch<ScrollLocReducerActions>;
	getPositions(this: void, track: string): ScrollLoc;
	loadStorage(this: void, track: string): ScrollLoc;
};

const initialScrollLocState: ScrollLocReducerState = {};

const defaultScrollLocState: ScrollLocReducerState[string] = {
	contextState: 'all',
	pos: null,
	id: null,
};

const ScrollStateContext = createContext<ScrollStateContextProps>({
	state: initialScrollLocState,
	dispatch: () => undefined,
	getPositions: () => ({}),
	loadStorage: () => ({}),
});

export default ScrollStateContext;

type ScrollLocReducerActions =
	| {
			type: 'updatePos';
			payload: number;
			track: string;
	  }
	| {
			type: 'updateId';
			payload: string;
			track: string;
	  }
	| {
			type: 'updatePositions';
			payload: {
				pos: number;
				id: string;
			};
			track: string;
	  }
	| {
			type: 'updateAll';
			payload: {
				contextState: string;
				pos: number | null;
				id: string | null;
			};
			track: string;
	  }
	| {
			type: 'updateContextState';
			payload: string;
			track: string;
	  }
	| {
			type: 'resetPositions';
			track: string;
	  }
	| {
			type: 'resetAll';
			track: string;
	  };

const scrollLocReducer = (
	state: ScrollLocReducerState,
	action: ScrollLocReducerActions
) => {
	const track = action.track;
	const curTrackState = state[track] || defaultScrollLocState;
	switch (action.type) {
		case 'updatePos': {
			return {
				...state,
				[track]: { ...curTrackState, pos: action.payload },
			};
		}
		case 'updateId': {
			return {
				...state,
				[track]: { ...curTrackState, id: action.payload },
			};
		}
		case 'updatePositions': {
			return {
				...state,
				[track]: {
					...curTrackState,
					pos: action.payload.pos,
					id: action.payload.id,
				},
			};
		}
		case 'updateAll': {
			return {
				...state,
				[track]: {
					...curTrackState,
					contextState: action.payload.contextState,
					pos: action.payload.pos,
					id: action.payload.id,
				},
			};
		}
		case 'updateContextState': {
			return {
				...state,
				[track]: { ...curTrackState, contextState: action.payload },
			};
		}
		case 'resetPositions': {
			return {
				...state,
				[track]: { ...curTrackState, pos: null, id: null },
			};
		}
		case 'resetAll': {
			return {
				...state,
				[track]: {
					...curTrackState,
					contextState: 'all',
					pos: null,
					id: null,
				},
			};
		}
		default: {
			return state;
		}
	}
};

export const ScrollLocProvider: React.FC<{ children?: ReactNode }> = ({
	children,
}) => {
	const storage = useContext(StorageContext);

	const [state, dispatch] = useReducer(
		scrollLocReducer,
		initialScrollLocState
	);

	const getPositions = useCallback(
		(track: string) => {
			const returnObj: ScrollLoc = {};
			const trackState = state[track];
			if (trackState) {
				const { id, pos } = trackState;
				if (id) {
					returnObj.id = id;
				}
				if (pos) {
					returnObj.pos = pos;
				}
			}
			dispatch({ type: 'resetPositions', track });
			return returnObj;
		},
		[state]
	);

	const loadStorage = useCallback(
		(track: string) => {
			const returnObj: ScrollLoc = {};
			const savedState = storage.loadSavedState();
			if (savedState) {
				const trackState = savedState[track];
				if (trackState) {
					const { contextState, pos, id } = trackState;
					dispatch({
						type: 'updateAll',
						payload: { contextState, pos, id },
						track,
					});
					if (id) {
						returnObj.id = id;
					}
					if (pos) {
						returnObj.pos = pos;
					}
				}
			}
			return returnObj;
		},
		[storage]
	);

	useEffect(() => {
		storage.saveState(state);
	}, [storage, state]);

	return (
		<ScrollStateContext.Provider
			value={{
				state,
				dispatch,
				getPositions,
				loadStorage,
			}}
		>
			{children}
		</ScrollStateContext.Provider>
	);
};

export const { Consumer: ScrollLocConsumer } = ScrollStateContext;
