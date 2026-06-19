import { useCallback, useRef, useEffect } from 'react';

type Callback = () => void | Promise<void>;

export function useDebounce(callback: Callback, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback();
      }, delay);
    },
    [callback, delay]
  );
}
