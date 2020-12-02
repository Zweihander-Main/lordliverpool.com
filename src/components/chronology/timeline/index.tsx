import React from 'react';
import styles from './timeline.module.scss';
import useTimeline from 'hooks/useTimeline';
import useGrabber from 'hooks/useGrabber';
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
	const tickContent = React.useMemo(() => {
		const returnArray = [];
		for (let i = 0, len = ticks.length; i < len; i++) {
			returnArray.push(<span key={i} className={styles.tick}></span>);
		}
		return returnArray;
	}, [ticks]);

	const yearRef = React.useRef<HTMLTimeElement>(null);

	const {
		percentageAlong,
		yearOffset,
		areaGrabberLeftEdge,
		areaGrabberWidth,
		containerOverViewport,
	} = useTimeline(cardContainerRef, cardContainerWrapperRef, yearRef);

	const currentTick = Math.ceil(percentageAlong * ticks.length - 1);
	const year = ticks[currentTick] || ticks[0] || '1800';

	const {
		onGrabberMouseDown,
		onGrabberTouchStart,
		isUserDragging,
	} = useGrabber(cardContainerWrapperRef, containerOverViewport);

	const [rafYearOffset, setRafYearOffset] = React.useState(0);
	const [rafAreaGrabberLeftEdge, setRafAreaGrabberLeftEdge] = React.useState(
		0
	);
	const [rafAreaGrabberWidth, setRabAreaGrabberWidth] = React.useState(0);
	const [rafYear, setRafYear] = React.useState('');
	const [rafIsUserDragging, setRafIsUserDragging] = React.useState(false);

	const [isScrolling, setIsScrolling] = React.useState(false);
	const [rafIsScrolling, setRafIsScrolling] = React.useState(false);
	const scrollingLatch = React.useRef<number | undefined>();

	React.useEffect(() => {
		const cancelLatch = () => {
			if (scrollingLatch) {
				window.clearTimeout(scrollingLatch.current);
				scrollingLatch.current = undefined;
			}
		};
		cancelLatch();
		if (!isScrolling) {
			setIsScrolling(true);
		}
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

	const scheduleAnimationUpdate = rafSchd(setRafValues);

	React.useEffect(() => {
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

	console.log(scrollingLatch);

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

export default Timeline;
