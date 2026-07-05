import { useCallback, useEffect, useRef } from "react";

export const DEFAULT_PRESS_DEBOUNCE_MS = 700;

export function useDebouncedPress<TArgs extends unknown[]>(
  callback: ((...args: TArgs) => void) | undefined,
  delayMs = DEFAULT_PRESS_DEBOUNCE_MS
) {
  const callbackRef = useRef(callback);
  const isLockedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: TArgs) => {
      if (!callbackRef.current || isLockedRef.current) {
        return;
      }

      isLockedRef.current = true;
      callbackRef.current(...args);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        isLockedRef.current = false;
        timeoutRef.current = null;
      }, delayMs);
    },
    [delayMs]
  );
}
