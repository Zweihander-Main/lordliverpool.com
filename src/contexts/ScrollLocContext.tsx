import React, { createContext, useCallback, useState } from 'react';
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
};

const ScrollStateContext = createContext<ScrollStateContextProps>({
	contextState: 'all',
	setContextState: () => null,
	setPos: () => null,
	setId: () => null,
	getScrollLoc: () => ({}),
});

export default ScrollStateContext;

export const ScrollLocProvider: React.FC = ({ children }) => {
	// const storage = useContext(StorageContext);

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

	return (
		<ScrollStateContext.Provider
			value={{
				contextState,
				setContextState,
				setPos,
				setId,
				getScrollLoc,
			}}
		>
			{children}
		</ScrollStateContext.Provider>
	);
};

export const { Consumer: ScrollLocConsumer } = ScrollStateContext;
