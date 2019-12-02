import { useState, useEffect } from "react";
import { isRunningInJest } from "./utils";

/**
 * Bind to the debounced value to get debounced value changes
 * @param value The non-debounced value
 * @param delay The debouncing delay
 */
export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    // To avoid waiting on debounces in tests, we shorten the debounce time to a minimum during tests.
    delay = isRunningInJest() ? 1 : delay;

    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
