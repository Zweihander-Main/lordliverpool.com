import React, { useState, useEffect } from 'react';

const useTimelineWidth = (
	viewportRef: React.RefObject<HTMLElement>,
	containerRef: React.RefObject<HTMLDivElement>,
	containerWrapperRef: React.RefObject<HTMLDivElement>,
	selectedCategory: string
) => {
	const [viewportWidth, setViewportWidth] = useState(0);
	const [containerWidth, setContainerWidth] = useState(0);
	const [startPos, setStartPos] = useState(0);

	useEffect(() => {
		const setWidths = () => {
			setViewportWidth(viewportRef.current?.offsetWidth || 0);
			setContainerWidth(containerRef.current?.offsetWidth || 0);
			console.log(
				containerRef.current,
				containerRef.current?.offsetWidth
			);
		};

		const setPos = () => {
			setStartPos(containerRef.current?.getBoundingClientRect().x || 0);
		};

		const handleResize = () => {
			setWidths();
			setPos();
		};

		const handleScroll = () => {
			setPos();
		};

		if (viewportRef.current && containerRef.current) {
			// Wait 300ms for animations to clear before sampling width
			setTimeout(() => {
				setWidths();
				setPos();
			}, 300);
		}

		window.addEventListener('resize', handleResize);
		containerWrapperRef.current?.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('resize', handleResize);
			containerWrapperRef.current?.removeEventListener(
				'scroll',
				handleScroll
			);
		};
	}, [viewportRef, containerRef, containerWrapperRef, selectedCategory]);

	return [viewportWidth, containerWidth, startPos];
};

export default useTimelineWidth;
