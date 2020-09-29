import React, { useState, useEffect } from 'react';

const useDragScroll = (grabberRef: React.RefObject<HTMLDivElement>) => {
	const [isScrolling, setIsScrolling] = React.useState(false);
	const [clientX, setClientX] = React.useState(0);
	const [scrollLeft, setScrollLeft] = React.useState(0);

	useEffect(() => {
		if (isScrolling) {
		}

		const toggleScrolling = (isEnable) => {
			if (isEnable) {
				window.addEventListener('mousemove', onMouseMove);
				window.addEventListener('mouseup', onMouseUp);
			} else {
				window.removeEventListener('mousemove', onMouseMove);
			}
		};

		const onScroll = (event) => {};

		const onMouseMove = (
			event: React.MouseEvent<HTMLDivElement, 'mousemove'>
		) => {
			if (grabberRef.current) {
				grabberRef.current.scrollLeft =
					scrollLeft - clientX + event.clientX;
			}
		};

		const onMouseUp = () => {
			setIsScrolling(false);
			setClientX(0);
			setScrollLeft(0);
		};

		const onMouseDown = (
			event: React.MouseEvent<HTMLDivElement, 'mousedown'>
		) => {
			setIsScrolling(true);
			setClientX(event.clientX);
			if (grabberRef.current) {
				setScrollLeft(grabberRef.current.scrollLeft);
			}
		};

		return () => {
			window.removeEventListener('mouseup', onMouseUp);
			window.removeEventListener('mousemove', onMouseMove);
		};
	}, [grabberRef]);

	return null;
};

export default useDragScroll;
