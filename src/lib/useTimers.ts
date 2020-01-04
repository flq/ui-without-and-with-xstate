import { SimpleHandler } from "./utils";
import { useRef, useEffect } from "react";

export function useInterval(
  callback: SimpleHandler,
  delay: number,
  additionalDeps: any[] = []
) {
  useTimeThing("Interval", callback, delay, additionalDeps);
}

export function useTimeout(
  callback: SimpleHandler,
  delay: number,
  additionalDeps: any[] = []
) {
  useTimeThing("Timeout", callback, delay, additionalDeps);
}

function useTimeThing(
  mode: "Interval" | "Timeout",
  callback: SimpleHandler,
  delay: number,
  additionalDeps: any[] = []
) {
  const [set, clear] =
    mode === "Interval"
      ? [setInterval, clearInterval]
      : [setTimeout, clearTimeout];
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
      const id = set(tick, delay);
      return () => clear(id);
    }
  }, [delay, ...additionalDeps]);
}
