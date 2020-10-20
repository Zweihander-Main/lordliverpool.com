import React from 'react';
import styles from './timeline.module.scss';
import useTimeline from 'hooks/useTimeline';
import useGrabber from 'hooks/useGrabber';
import rafSchd from 'raf-schd';

type TimelineProps = {
	ticks: Array<string>;
	cardContainerWrapperRef: React.RefObject<HTMLDivElement>;
	cardContainerRef: React.RefObject<HTMLDivElement>;
};

const Timeline: React.FC<TimelineProps> = ({
	ticks,
	cardContainerWrapperRef,
	cardContainerRef,
}) => {
	const tickContent = [];
	for (let i = 0, len = ticks.length; i < len; i++) {
		tickContent.push(<span key={i} className={styles.tick}></span>);
	}

	let yearRef = React.useRef<HTMLTimeElement>(null);

	const {
		percentageAlong,
		yearOffset,
		areaGrabberLeftEdge,
		areaGrabberWidth,
		containerOverViewport,
	} = useTimeline(cardContainerRef, cardContainerWrapperRef, yearRef);

	const currentTick = Math.ceil(percentageAlong * ticks.length - 1);
	const year = ticks[currentTick] || ticks[0] || '1800';

	const { onGrabberMouseDown, onGrabberTouchStart, isScrolling } = useGrabber(
		cardContainerWrapperRef,
		containerOverViewport
	);

	const [rafYearOffset, setRafYearOffset] = React.useState(0);
	const [rafAreaGrabberLeftEdge, setRafAreaGrabberLeftEdge] = React.useState(
		0
	);
	const [rafAreaGrabberWidth, setRabAreaGrabberWidth] = React.useState(0);
	const [rafYear, setRafYear] = React.useState('');
	const [rafIsScrolling, setRafIsScrolling] = React.useState(false);

	const setRafValues = (
		offset: number,
		leftEdge: number,
		width: number,
		yearString: string,
		scrolling: boolean
	) => {
		setRafYearOffset(offset);
		setRafAreaGrabberLeftEdge(leftEdge);
		setRabAreaGrabberWidth(width);
		setRafYear(yearString);
		setRafIsScrolling(scrolling);
	};

	const scheduleAnimationUpdate = rafSchd(setRafValues);

	React.useEffect(() => {
		scheduleAnimationUpdate(
			yearOffset,
			areaGrabberLeftEdge,
			areaGrabberWidth,
			year,
			isScrolling
		);
		return () => {
			scheduleAnimationUpdate.cancel();
		};
	}, [yearOffset, areaGrabberWidth, areaGrabberLeftEdge, year, isScrolling]);

	return (
		<div className={styles.timeline}>
			<div
				className={
					rafIsScrolling
						? `${styles.areaGrabber} ${styles.isScrolling}`
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
