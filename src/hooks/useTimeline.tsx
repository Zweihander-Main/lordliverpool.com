import React, { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useTimeline = (
	containerRef: React.RefObject<HTMLDivElement>,
	containerWrapperRef: React.RefObject<HTMLElement | undefined>,
	yearRef: React.RefObject<HTMLTimeElement>
) => {
	const [viewportWidth, setViewportWidth] = useState(0);
	const [containerWidth, setContainerWidth] = useState(0);
	const [startPos, setStartPos] = useState(0);
	const [percentageAlong, setPercentageAlong] = useState(0);
	const [yearOffset, setYearOffset] = useState(0);
	const [areaGrabberLeftEdge, setAreaGrabberLeftEdge] = useState(0);
	const [
		viewportOverContainer,
		containerOverViewport,
		containerMinusViewport,
		areaGrabberWidth,
	] = React.useMemo(() => {
		const vOC = viewportWidth / containerWidth;
		const cOV = containerWidth / viewportWidth;
		const cMV = containerWidth - viewportWidth;
		let width: number = vOC * viewportWidth;
		if (!width || !isFinite(width)) {
			width = 10;
		}
		return [vOC, cOV, cMV, width];
	}, [containerWidth, viewportWidth]);

	// TODO bug which causes leftedge to be 0 on load

	const calculateAreaGrabberLeftEdge = () => {
		let leftEdge = -(startPos * viewportOverContainer) || 0;
		if (leftEdge + areaGrabberWidth > viewportWidth) {
			leftEdge = viewportWidth - areaGrabberWidth;
		}
		setAreaGrabberLeftEdge(leftEdge);
	};

	const calculatePercentageAlong = () => {
		let percentage = Math.abs(startPos / containerMinusViewport);
		if (percentage > 1) {
			percentage = 1;
		}
		setPercentageAlong(percentage);
	};

	useEffect(() => {
		calculateAreaGrabberLeftEdge();
		calculatePercentageAlong();
	}, [viewportWidth, containerWidth, startPos]);

	const calculateYearOffset = () => {
		const yearWidth = yearRef.current?.offsetWidth || 0;
		setYearOffset(percentageAlong * (areaGrabberWidth - yearWidth));
	};

	useEffect(() => {
		calculateYearOffset();
	}, [yearRef, percentageAlong]);

	const setPos = () => {
		setStartPos(containerRef.current?.getBoundingClientRect().x || 0);
	};

	const handleWindowResize = () => {
		setViewportWidth(window.innerWidth);
		setPos();
	};

	const handleScroll = () => {
		setPos();
	};

	const containerResizeObserver = new ResizeObserver(([container]) => {
		containerRef.current &&
			setContainerWidth(container.contentRect.width || 0);
	});

	useEffect(() => {
		setViewportWidth(window.innerWidth || 0);
		window.addEventListener('resize', handleWindowResize);
		containerWrapperRef.current?.addEventListener('scroll', handleScroll);
		containerRef.current &&
			containerResizeObserver.observe(containerRef.current);

		return () => {
			containerRef.current &&
				containerResizeObserver.unobserve(containerRef.current);
			window.removeEventListener('resize', handleWindowResize);
			containerWrapperRef.current?.removeEventListener(
				'scroll',
				handleScroll
			);
		};
	}, [containerRef, containerWrapperRef]);

	return {
		percentageAlong,
		yearOffset,
		areaGrabberLeftEdge,
		areaGrabberWidth,
		containerOverViewport,
	};
};

export default useTimeline;
