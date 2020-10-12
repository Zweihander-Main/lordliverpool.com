import React from 'react';

const useJS = () => {
	const [hasJS, setJS] = React.useState(false);

	React.useEffect(() => {
		setJS(true);
	}, []);
	return hasJS;
};

export default useJS;
