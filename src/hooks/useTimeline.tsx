import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useTimeline = (
	containerRef: React.RefObject<HTMLElement>,
	containerWrapperRef: React.RefObject<HTMLElement>,
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

	const calculateAreaGrabberLeftEdge = useCallback(() => {
		let leftEdge = -(startPos * viewportOverContainer) || 0;
		if (leftEdge + areaGrabberWidth > viewportWidth) {
			leftEdge = viewportWidth - areaGrabberWidth;
		}
		setAreaGrabberLeftEdge(leftEdge);
	}, [areaGrabberWidth, startPos, viewportOverContainer, viewportWidth]);

	const calculatePercentageAlong = useCallback(() => {
		let percentage = Math.abs(startPos / containerMinusViewport);
		if (percentage > 1) {
			percentage = 1;
		}
		setPercentageAlong(percentage);
	}, [containerMinusViewport, startPos]);

	useEffect(() => {
		calculateAreaGrabberLeftEdge();
		calculatePercentageAlong();
	}, [
		viewportWidth,
		containerWidth,
		startPos,
		calculateAreaGrabberLeftEdge,
		calculatePercentageAlong,
	]);

	const calculateYearOffset = useCallback(() => {
		const yearWidth = yearRef.current?.offsetWidth || 0;
		setYearOffset(percentageAlong * (areaGrabberWidth - yearWidth));
	}, [yearRef, percentageAlong, areaGrabberWidth]);

	useEffect(() => {
		calculateYearOffset();
	}, [yearRef, percentageAlong, calculateYearOffset]);

	const setPos = useCallback(() => {
		setStartPos(containerRef.current?.getBoundingClientRect().x || 0);
	}, [containerRef]);

	const handleWindowResize = useCallback(() => {
		setViewportWidth(window.innerWidth);
		setPos();
	}, [setPos]);

	const handleScroll = useCallback(() => {
		setPos();
	}, [setPos]);

	const containerResizeObserver = useMemo(
		() =>
			new ResizeObserver(([container]) => {
				containerRef.current &&
					setContainerWidth(container.contentRect.width || 0);
			}),

		[containerRef]
	);

	useEffect(() => {
		const container = containerRef.current;
		setViewportWidth(window.innerWidth || 0);
		window.addEventListener('resize', handleWindowResize);
		containerWrapperRef.current?.addEventListener('scroll', handleScroll);
		containerRef.current &&
			containerResizeObserver.observe(containerRef.current);

		return () => {
			container && containerResizeObserver.unobserve(container);
			window.removeEventListener('resize', handleWindowResize);
			container?.removeEventListener('scroll', handleScroll);
		};
	}, [
		containerRef,
		containerWrapperRef,
		containerResizeObserver,
		handleScroll,
		handleWindowResize,
	]);

	return {
		percentageAlong,
		yearOffset,
		areaGrabberLeftEdge,
		areaGrabberWidth,
		containerOverViewport,
	};
};

export default useTimeline;
