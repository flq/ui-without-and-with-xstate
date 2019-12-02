import { SimpleHandler } from "./utils";
import { useRef, useEffect } from "react";

/**
 * This hook allows to safely use a setTimeout in the context of a react component.
 * It is mostly based on Dan Abramov's post https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * One change is the inclusion of additional dependencies which allows to retrigger the timeout when something in
 * the provided dependencies changes.
 * @param callback This will be called after the delay
 * @param delay the delay in milliseconds
 * @param additionalDeps if you want to retrigger the timeout by some state change, put them in here
 */
export function useTimeout(callback: SimpleHandler, delay: number, additionalDeps: any[] = []) {
    const savedCallback = useRef<SimpleHandler>(callback);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            const id = setTimeout(tick, delay);
            return () => clearTimeout(id);
        }
    }, [delay, ...additionalDeps]);
}
