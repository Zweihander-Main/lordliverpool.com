import React from 'react';
import styles from './timeline.module.scss';

type TimelineProps = {
	viewportWidth: number;
	containerWidth: number;
	startPos: number;
	ticks: Array<string>;
	cardContainerWrapperRef: React.RefObject<HTMLDivElement>;
};

const Timeline: React.FC<TimelineProps> = ({
	ticks,
	viewportWidth,
	containerWidth,
	startPos,
	cardContainerWrapperRef,
}) => {
	const tickContent = [];
	for (let i = 0, len = ticks.length; i < len; i++) {
		tickContent.push(<span key={i} className={styles.tick}></span>);
	}

	let areaGrabberWidth = 0;
	let areaGrabberLeftEdge = 0;
	let yearRef = React.useRef<HTMLTimeElement>(null);

	let percentageAlong = 0;
	let currentTick = 0;
	let year = ticks[0] || '1800';
	let yearWidth = 0;
	let yearOffset = 0;

	if (containerWidth !== 0) {
		areaGrabberLeftEdge = -(startPos / containerWidth) * viewportWidth || 0;
		areaGrabberWidth =
			(viewportWidth / containerWidth) * viewportWidth || 0;
		if (areaGrabberLeftEdge + areaGrabberWidth > viewportWidth) {
			areaGrabberLeftEdge = viewportWidth - areaGrabberWidth;
		}

		percentageAlong = Math.abs(startPos / (containerWidth - viewportWidth));
		if (percentageAlong > 1) {
			percentageAlong = 1;
		}
		currentTick = Math.ceil(percentageAlong * ticks.length - 1);
		year = ticks[currentTick] || ticks[0] || '1800';
		yearWidth = yearRef.current ? yearRef.current.offsetWidth : 0;
		yearOffset = percentageAlong * (areaGrabberWidth - yearWidth);
	}

	const [isScrolling, setIsScrolling] = React.useState(false);
	const [containerX, setContainerX] = React.useState(0);
	const [grabberX, setGrabberX] = React.useState(0);

	const handleGrabberMove = (clientX: number) => {
		if (cardContainerWrapperRef.current) {
			const scrollDistance = clientX - grabberX;
			const toScroll = (scrollDistance / viewportWidth) * containerWidth;
			cardContainerWrapperRef.current.scrollTop = containerX + toScroll;
		}
	};

	const onGrabberMouseMove = (event: MouseEvent) => {
		handleGrabberMove(event.clientX);
	};

	const onGrabberTouchMove = (event: TouchEvent) => {
		handleGrabberMove(event.touches[0].clientX);
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
			window.addEventListener('mousemove', onGrabberMouseMove);
			window.addEventListener('mouseup', onGrabberEnd);
			window.addEventListener('touchend', onGrabberEnd);
			window.addEventListener('touchcancel', onGrabberEnd);
			window.addEventListener('touchmove', onGrabberTouchMove);
		} else {
			removeListeners();
		}

		return () => {
			removeListeners();
		};
	}, [isScrolling]);

	return (
		<div className={styles.timeline}>
			<div
				className={
					isScrolling
						? `${styles.areaGrabber} ${styles.isScrolling}`
						: styles.areaGrabber
				}
				onMouseDown={onGrabberMouseDown}
				onTouchStart={onGrabberTouchStart}
				style={{
					left: areaGrabberLeftEdge,
					width: areaGrabberWidth,
				}}
			>
				<time
					ref={yearRef}
					className={styles.year}
					dateTime={year}
					style={{
						left: yearOffset,
					}}
				>
					{year}
				</time>
			</div>
			{tickContent}
		</div>
	);
};

export default Timeline;
