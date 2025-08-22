import { useState, useEffect, useRef } from "react";

export function useDebounce<T>(value: T, delay: number):T {
    const [ debounceValue, setDebounceValue ] = useState<T>(value);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setDebounceValue(value)
        }, delay);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [value, delay])

    return debounceValue;
}