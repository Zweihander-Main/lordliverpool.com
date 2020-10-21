import React from 'react';
import rafSchd from 'raf-schd';

const useGrabber = (
	cardContainerWrapperRef: React.RefObject<HTMLElement | undefined>,
	containerOverViewport: number
) => {
	const [isScrolling, setIsScrolling] = React.useState(false);
	const [containerX, setContainerX] = React.useState(0);
	const [grabberX, setGrabberX] = React.useState(0);

	const handleGrabberMove = (clientX: number) => {
		if (cardContainerWrapperRef.current) {
			const scrollDistance = clientX - grabberX;
			const toScroll = scrollDistance * containerOverViewport;
			cardContainerWrapperRef.current.scrollTop = containerX + toScroll;
		}
	};

	const scheduledHandleGrabberMove = rafSchd(handleGrabberMove);

	const onGrabberMouseMove = (event: MouseEvent) => {
		scheduledHandleGrabberMove(event.clientX);
	};

	const onGrabberTouchMove = (event: TouchEvent) => {
		scheduledHandleGrabberMove(event.touches[0].clientX);
	};

	const onGrabberEnd = () => {
		setIsScrolling(false);
		setContainerX(0);
		setGrabberX(0);
	};

	const handleGrabberStart = (clientX: number) => {
		if (cardContainerWrapperRef.current) {
			setContainerX(cardContainerWrapperRef.current.scrollTop);
		}
		setGrabberX(clientX);
		setIsScrolling(true);
	};

	const onGrabberMouseDown = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		handleGrabberStart(event.clientX);
	};

	const onGrabberTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
		handleGrabberStart(event.touches[0].clientX);
	};

	React.useEffect(() => {
		const removeListeners = () => {
			window.removeEventListener('mouseup', onGrabberEnd);
			window.removeEventListener('mousemove', onGrabberMouseMove);
			window.removeEventListener('touchend', onGrabberEnd);
			window.removeEventListener('touchcancel', onGrabberEnd);
			window.removeEventListener('touchmove', onGrabberTouchMove);
		};

		if (isScrolling) {
			window.addEventListener('mouseup', onGrabberEnd);
			window.addEventListener('mousemove', onGrabberMouseMove);
			window.addEventListener('touchend', onGrabberEnd);
			window.addEventListener('touchcancel', onGrabberEnd);
			window.addEventListener('touchmove', onGrabberTouchMove);
		} else {
			removeListeners();
		}

		return () => {
			scheduledHandleGrabberMove.cancel();
			removeListeners();
		};
	}, [isScrolling]);

	return { onGrabberMouseDown, onGrabberTouchStart, isScrolling };
};

export default useGrabber;
