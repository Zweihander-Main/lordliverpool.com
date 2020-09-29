import { useRef, useEffect } from 'react';

const useEventListener = <K extends keyof HTMLElementEventMap>(
	eventName: K,
	handler: HTMLElementEventMap[K],
	element: React.ReactHTMLElement<HTMLElement> | Window = window
) => {
	const savedHandler = useRef<HTMLElementEventMap[K]>();

	useEffect(() => {
		if (savedHandler.current) {
			savedHandler.current = handler;
		}
	}, [handler]);

	useEffect(() => {
		const isSupported = element && element.addEventListener;
		if (!isSupported) return;

		if (!(savedHandler && savedHandler.current)) return;

		const eventListener = (event) => savedHandler.current(event);

		element.addEventListener(eventName, eventListener);

		return () => {
			element.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element]);
};
