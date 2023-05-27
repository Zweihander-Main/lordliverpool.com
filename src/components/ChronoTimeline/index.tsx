import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as styles from './ChronoTimeline.module.scss';
import useTimeline from '../../hooks/useTimeline';
import useGrabber from '../../hooks/useGrabber';
import rafSchd from 'raf-schd';

type TimelineProps = {
	ticks: Array<string>;
	cardContainerWrapperRef: React.RefObject<HTMLElement>;
	cardContainerRef: React.RefObject<HTMLElement>;
};

const Timeline: React.FC<TimelineProps> = ({
	ticks,
	cardContainerWrapperRef,
	cardContainerRef,
}) => {
	const tickContent = useMemo(() => {
		const returnArray = [];
		for (let i = 0, len = ticks.length; i < len; i++) {
			returnArray.push(<span key={i} className={styles.tick}></span>);
		}
		return returnArray;
	}, [ticks]);

	const yearRef = useRef<HTMLTimeElement>(null);

	const {
		percentageAlong,
		yearOffset,
		areaGrabberLeftEdge,
		areaGrabberWidth,
		containerOverViewport,
	} = useTimeline(cardContainerRef, cardContainerWrapperRef, yearRef);

	const currentTick = Math.ceil(percentageAlong * ticks.length - 1);
	const year = ticks[currentTick] || ticks[0] || '1800';

	const { onGrabberMouseDown, onGrabberTouchStart, isUserDragging } =
		useGrabber(cardContainerWrapperRef, containerOverViewport);

	const [rafYearOffset, setRafYearOffset] = useState(0);
	const [rafAreaGrabberLeftEdge, setRafAreaGrabberLeftEdge] = useState(0);
	const [rafAreaGrabberWidth, setRabAreaGrabberWidth] = useState(0);
	const [rafYear, setRafYear] = useState('');
	const [rafIsUserDragging, setRafIsUserDragging] = useState(false);

	const [isScrolling, setIsScrolling] = useState(false);
	const [rafIsScrolling, setRafIsScrolling] = useState(false);
	const scrollingLatch = useRef<number | undefined>();

	useEffect(() => {
		const cancelLatch = () => {
			if (scrollingLatch) {
				window.clearTimeout(scrollingLatch.current);
				scrollingLatch.current = undefined;
			}
		};
		cancelLatch();
		setIsScrolling(true);
		if (!isUserDragging) {
			scrollingLatch.current = window.setTimeout(() => {
				setIsScrolling(false);
			}, 250);
		}

		return () => {
			cancelLatch();
		};
	}, [isUserDragging, areaGrabberLeftEdge]);

	const setRafValues = (
		offset: number,
		leftEdge: number,
		width: number,
		yearString: string,
		scrolling: boolean,
		dragging: boolean
	) => {
		setRafYearOffset(offset);
		setRafAreaGrabberLeftEdge(leftEdge);
		setRabAreaGrabberWidth(width);
		setRafYear(yearString);
		setRafIsScrolling(scrolling);
		setRafIsUserDragging(dragging);
	};

	useEffect(() => {
		const scheduleAnimationUpdate = rafSchd(setRafValues);
		scheduleAnimationUpdate(
			yearOffset,
			areaGrabberLeftEdge,
			areaGrabberWidth,
			year,
			isScrolling,
			isUserDragging
		);
		return () => {
			scheduleAnimationUpdate.cancel();
		};
	}, [
		yearOffset,
		areaGrabberWidth,
		areaGrabberLeftEdge,
		year,
		isScrolling,
		isUserDragging,
	]);

	return (
		<div
			className={
				rafIsScrolling
					? `${styles.timeline} ${styles.isScrolling}`
					: styles.timeline
			}
		>
			<div
				className={
					rafIsUserDragging
						? `${styles.areaGrabber} ${styles.isUserDragging}`
						: styles.areaGrabber
				}
				onMouseDown={onGrabberMouseDown}
				onTouchStart={onGrabberTouchStart}
				role={'scrollbar'}
				aria-controls={'chronology-scrolling-container'}
				aria-valuenow={areaGrabberLeftEdge}
				aria-valuetext={year}
				tabIndex={0}
				style={{
					transform: `translateX(${rafAreaGrabberLeftEdge}px)`,
					width: rafAreaGrabberWidth,
				}}
			>
				<time
					ref={yearRef}
					className={styles.year}
					dateTime={rafYear}
					style={{
						transform: `translateX(${rafYearOffset}px)`,
					}}
				>
					{rafYear}
				</time>
			</div>
			{tickContent}
		</div>
	);
};

const MemoizedTimeline = memo(
	Timeline,
	(prevProps, nextProps) => prevProps.ticks.length === nextProps.ticks.length
);

export default MemoizedTimeline;
