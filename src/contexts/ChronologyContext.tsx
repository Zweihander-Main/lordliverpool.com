import * as React from 'react';
import { SessionStorage } from 'utils/session-storage';

const defaultCategory = 'all';
const categoryKey = 'SELECTED_CATEGORY';

export type ChronologyContextState = {
	selectedCategory: string;
	setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
};

const ChronologyContext = React.createContext<ChronologyContextState>({
	selectedCategory: defaultCategory,
	setSelectedCategory: () => {},
});

export default ChronologyContext;

type ChronologyProviderProps = {
	children: React.ReactNode;
};

export const ChronologyProvider: React.FC<ChronologyProviderProps> = ({
	children,
}) => {
	const _stateStorage = new SessionStorage();

	// Blocking but necessary to ensure that the saved
	// scroll position from useScrollRestoration is always correct
	// Alternative is to create own version of
	// gatsby-react-router-scroll
	const [selectedCategory, setSelectedCategory] = React.useState<string>(
		_stateStorage.read(categoryKey) || defaultCategory
	);

	React.useEffect(() => {
		console.log('update');
		_stateStorage.save(categoryKey, selectedCategory);
	}, [selectedCategory]);

	return (
		<ChronologyContext.Provider
			value={{ selectedCategory, setSelectedCategory }}
		>
			{children}
		</ChronologyContext.Provider>
	);
};

export const { Consumer: ChronologyConsumer } = ChronologyContext;
