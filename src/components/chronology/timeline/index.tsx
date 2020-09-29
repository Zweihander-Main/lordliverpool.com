import React from 'react';
import styles from './timeline.module.scss';
import { cardContainerWrapper } from '../chronology.module.scss';

type TimelineProps = {
	viewportWidth: number;
	containerWidth: number;
	startPos: number;
	ticks: number;
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
	for (let i = 0; i < ticks; i++) {
		tickContent.push(<span key={i} className={styles.tick}></span>);
	}

	let areaGrabberLeftEdge = 0;
	let areaGrabberWidth = 0;

	if (containerWidth !== 0) {
		areaGrabberLeftEdge = -(startPos / containerWidth) * viewportWidth || 0;
		areaGrabberWidth =
			(viewportWidth / containerWidth) * viewportWidth || 0;
	}

	const [isScrolling, setIsScrolling] = React.useState(false);
	const [containerX, setContainerX] = React.useState(0);
	const [grabberX, setGrabberX] = React.useState(0);

	const onGrabberMouseScroll = () => {};

	const onGrabberMouseMove = (event: MouseEvent) => {
		if (cardContainerWrapperRef.current) {
			const scrollDistance = event.clientX - grabberX;
			const toScroll = (scrollDistance / viewportWidth) * containerWidth;
			cardContainerWrapperRef.current.scrollTop = containerX + toScroll;
		}
	};

	const onGrabberMouseUp = () => {
		setIsScrolling(false);
		setContainerX(0);
		setGrabberX(0);
	};

	const onGrabberMouseDown = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (cardContainerWrapperRef.current) {
			setContainerX(cardContainerWrapperRef.current.scrollTop);
		}
		setGrabberX(event.clientX);
		setIsScrolling(true);
	};

	React.useEffect(() => {
		if (isScrolling) {
			window.addEventListener('mousemove', onGrabberMouseMove);
			window.addEventListener('mouseup', onGrabberMouseUp);
		} else {
			window.removeEventListener('mousemove', onGrabberMouseMove);
			window.removeEventListener('mouseup', onGrabberMouseUp); // TODO test?
		}
		return () => {
			window.removeEventListener('mouseup', onGrabberMouseUp);
			window.removeEventListener('mousemove', onGrabberMouseMove);
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
				onScroll={onGrabberMouseScroll}
				style={{
					left: areaGrabberLeftEdge,
					width: areaGrabberWidth,
				}}
			></div>
			{tickContent}
		</div>
	);
};

export default Timeline;
